/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../../../index";
import * as OpikApi from "../../../../../api/index";
import * as core from "../../../../../core";
export declare const DatasetIdentifier: core.serialization.Schema<serializers.DatasetIdentifier.Raw, OpikApi.DatasetIdentifier>;
export declare namespace DatasetIdentifier {
    interface Raw {
        dataset_name: string;
    }
}