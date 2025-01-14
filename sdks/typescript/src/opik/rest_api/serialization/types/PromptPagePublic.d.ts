/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
import { PromptPublic } from "./PromptPublic";
export declare const PromptPagePublic: core.serialization.ObjectSchema<serializers.PromptPagePublic.Raw, OpikApi.PromptPagePublic>;
export declare namespace PromptPagePublic {
    interface Raw {
        page?: number | null;
        size?: number | null;
        total?: number | null;
        content?: PromptPublic.Raw[] | null;
    }
}
