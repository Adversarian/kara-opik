/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../../../../index";
import * as OpikApi from "../../../../../api/index";
import * as core from "../../../../../core";
export declare const TracesDelete: core.serialization.Schema<serializers.TracesDelete.Raw, OpikApi.TracesDelete>;
export declare namespace TracesDelete {
    interface Raw {
        ids: string[];
    }
}
