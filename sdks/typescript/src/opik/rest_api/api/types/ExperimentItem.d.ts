/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as OpikApi from "../index";
export interface ExperimentItem {
    id?: string;
    experimentId: string;
    datasetItemId: string;
    traceId: string;
    input?: OpikApi.JsonNode;
    output?: OpikApi.JsonNode;
    feedbackScores?: OpikApi.FeedbackScore[];
    createdAt?: Date;
    lastUpdatedAt?: Date;
    createdBy?: string;
    lastUpdatedBy?: string;
}