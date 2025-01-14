import pytest
import mock
from typing import cast
from opik import context_storage
from opik.api_objects import opik_client
from .testlib import backend_emulator_message_processor
from opik.message_processing import streamer_constructors


@pytest.fixture(autouse=True)
def clear_context_storage():
    yield
    context_storage.clear_all()


@pytest.fixture(autouse=True)
def shutdown_cached_client_after_test():
    yield
    if opik_client.get_client_cached.cache_info().currsize > 0:
        opik_client.get_client_cached().end()
        opik_client.get_client_cached.cache_clear()


@pytest.fixture
def patch_streamer():
    try:
        fake_message_processor_ = (
            backend_emulator_message_processor.BackendEmulatorMessageProcessor()
        )
        streamer = streamer_constructors.construct_streamer(
            message_processor=fake_message_processor_,
            n_consumers=1,
            use_batching=True,
        )

        yield streamer, fake_message_processor_
    finally:
        streamer.close(timeout=5)


@pytest.fixture
def fake_backend(patch_streamer):
    """
    Patches the function that creates an instance of Streamer under the hood of Opik.
    As a result, instead of sending data to the backend, it's being passed to
    backend emulator, which uses this data to build span and trace trees.

    The resulting trees can be accessed via `fake_backend.trace_trees` or
    `fake_backend.span_trees` and then used for comparing with expected span/trace trees.

    The trees are built via special classes stored in testlib.models.
    """
    streamer, fake_message_processor_ = patch_streamer

    fake_message_processor_ = cast(
        backend_emulator_message_processor.BackendEmulatorMessageProcessor,
        fake_message_processor_,
    )

    mock_construct_online_streamer = mock.Mock()
    mock_construct_online_streamer.return_value = streamer

    with mock.patch.object(
        streamer_constructors,
        "construct_online_streamer",
        mock_construct_online_streamer,
    ):
        yield fake_message_processor_
