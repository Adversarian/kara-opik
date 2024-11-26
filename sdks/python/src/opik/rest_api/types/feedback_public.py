# This file was auto-generated by Fern from our API Definition.

from __future__ import annotations
from ..core.pydantic_utilities import UniversalBaseModel
import typing
import typing_extensions
import datetime as dt
from ..core.serialization import FieldMetadata
from ..core.pydantic_utilities import IS_PYDANTIC_V2
import pydantic
from .numerical_feedback_detail_public import NumericalFeedbackDetailPublic
from .categorical_feedback_detail_public import CategoricalFeedbackDetailPublic


class Base(UniversalBaseModel):
    id: typing.Optional[str] = None
    name: str
    created_at: typing_extensions.Annotated[
        typing.Optional[dt.datetime], FieldMetadata(alias="createdAt")
    ] = None
    created_by: typing_extensions.Annotated[
        typing.Optional[str], FieldMetadata(alias="createdBy")
    ] = None
    last_updated_at: typing_extensions.Annotated[
        typing.Optional[dt.datetime], FieldMetadata(alias="lastUpdatedAt")
    ] = None
    last_updated_by: typing_extensions.Annotated[
        typing.Optional[str], FieldMetadata(alias="lastUpdatedBy")
    ] = None

    if IS_PYDANTIC_V2:
        model_config: typing.ClassVar[pydantic.ConfigDict] = pydantic.ConfigDict(
            extra="allow", frozen=True
        )  # type: ignore # Pydantic v2
    else:

        class Config:
            frozen = True
            smart_union = True
            extra = pydantic.Extra.allow


class FeedbackPublic_Numerical(Base):
    type: typing.Literal["numerical"] = "numerical"
    details: typing.Optional[NumericalFeedbackDetailPublic] = None
    created_at: typing.Optional[dt.datetime] = None
    created_by: typing.Optional[str] = None
    last_updated_at: typing.Optional[dt.datetime] = None
    last_updated_by: typing.Optional[str] = None

    if IS_PYDANTIC_V2:
        model_config: typing.ClassVar[pydantic.ConfigDict] = pydantic.ConfigDict(
            extra="allow", frozen=True
        )  # type: ignore # Pydantic v2
    else:

        class Config:
            frozen = True
            smart_union = True
            extra = pydantic.Extra.allow


class FeedbackPublic_Categorical(Base):
    type: typing.Literal["categorical"] = "categorical"
    details: typing.Optional[CategoricalFeedbackDetailPublic] = None
    created_at: typing.Optional[dt.datetime] = None
    created_by: typing.Optional[str] = None
    last_updated_at: typing.Optional[dt.datetime] = None
    last_updated_by: typing.Optional[str] = None

    if IS_PYDANTIC_V2:
        model_config: typing.ClassVar[pydantic.ConfigDict] = pydantic.ConfigDict(
            extra="allow", frozen=True
        )  # type: ignore # Pydantic v2
    else:

        class Config:
            frozen = True
            smart_union = True
            extra = pydantic.Extra.allow


FeedbackPublic = typing.Union[FeedbackPublic_Numerical, FeedbackPublic_Categorical]
