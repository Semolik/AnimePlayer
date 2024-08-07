/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AnidubService {
    /**
     * Get Episode
     * @param linkHash
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getEpisodeApiV1ParsersAnidubEpisodeGet(
        linkHash: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/parsers/anidub/episode',
            query: {
                'link_hash': linkHash,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
