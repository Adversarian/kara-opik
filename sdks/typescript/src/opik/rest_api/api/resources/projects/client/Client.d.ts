/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as environments from "../../../../environments";
import * as core from "../../../../core";
import * as OpikApi from "../../../index";
export declare namespace Projects {
    interface Options {
        environment?: core.Supplier<environments.OpikApiEnvironment | string>;
    }
    interface RequestOptions {
        /** The maximum time to wait for a response in seconds. */
        timeoutInSeconds?: number;
        /** The number of times to retry the request. Defaults to 2. */
        maxRetries?: number;
        /** A hook to abort the request. */
        abortSignal?: AbortSignal;
        /** Additional headers to include in the request. */
        headers?: Record<string, string>;
    }
}
/**
 * Project related resources
 */
export declare class Projects {
    protected readonly _options: Projects.Options;
    constructor(_options?: Projects.Options);
    /**
     * Find projects
     *
     * @param {OpikApi.FindProjectsRequest} request
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.projects.findProjects()
     */
    findProjects(request?: OpikApi.FindProjectsRequest, requestOptions?: Projects.RequestOptions): core.APIPromise<OpikApi.ProjectPagePublic>;
    /**
     * Create project
     *
     * @param {OpikApi.ProjectWrite} request
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link OpikApi.BadRequestError}
     * @throws {@link OpikApi.UnprocessableEntityError}
     *
     * @example
     *     await client.projects.createProject({
     *         name: "name"
     *     })
     */
    createProject(request: OpikApi.ProjectWrite, requestOptions?: Projects.RequestOptions): core.APIPromise<void>;
    /**
     * Get project by id
     *
     * @param {string} id
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.projects.getProjectById("id")
     */
    getProjectById(id: string, requestOptions?: Projects.RequestOptions): core.APIPromise<OpikApi.ProjectPublic>;
    /**
     * Delete project by id
     *
     * @param {string} id
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link OpikApi.ConflictError}
     *
     * @example
     *     await client.projects.deleteProjectById("id")
     */
    deleteProjectById(id: string, requestOptions?: Projects.RequestOptions): core.APIPromise<void>;
    /**
     * Update project by id
     *
     * @param {string} id
     * @param {OpikApi.ProjectUpdate} request
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link OpikApi.BadRequestError}
     * @throws {@link OpikApi.UnprocessableEntityError}
     *
     * @example
     *     await client.projects.updateProject("id")
     */
    updateProject(id: string, request?: OpikApi.ProjectUpdate, requestOptions?: Projects.RequestOptions): core.APIPromise<void>;
    /**
     * Delete projects batch
     *
     * @param {OpikApi.BatchDelete} request
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.projects.deleteProjectsBatch({
     *         ids: ["ids"]
     *     })
     */
    deleteProjectsBatch(request: OpikApi.BatchDelete, requestOptions?: Projects.RequestOptions): core.APIPromise<void>;
    /**
     * Gets specified metrics for a project
     *
     * @param {string} id
     * @param {OpikApi.ProjectMetricRequestPublic} request
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link OpikApi.BadRequestError}
     * @throws {@link OpikApi.NotFoundError}
     *
     * @example
     *     await client.projects.getProjectMetrics("id")
     */
    getProjectMetrics(id: string, request?: OpikApi.ProjectMetricRequestPublic, requestOptions?: Projects.RequestOptions): core.APIPromise<OpikApi.ProjectMetricResponsePublic>;
    /**
     * Retrieve project
     *
     * @param {OpikApi.ProjectRetrievePublic} request
     * @param {Projects.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @throws {@link OpikApi.BadRequestError}
     * @throws {@link OpikApi.NotFoundError}
     * @throws {@link OpikApi.UnprocessableEntityError}
     *
     * @example
     *     await client.projects.retrieveProject({
     *         name: "name"
     *     })
     */
    retrieveProject(request: OpikApi.ProjectRetrievePublic, requestOptions?: Projects.RequestOptions): core.APIPromise<OpikApi.ProjectPublic>;
}