/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
export declare const FeedbackScoreCompareSource: core.serialization.Schema<serializers.FeedbackScoreCompareSource.Raw, OpikApi.FeedbackScoreCompareSource>;
export declare namespace FeedbackScoreCompareSource {
    type Raw = "ui" | "sdk";
}