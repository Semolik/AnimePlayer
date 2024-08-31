/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TitleEpisode } from '../models/TitleEpisode';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class EpisodesService {
    /**
     * Get Episodes
     * @param page
     * @returns TitleEpisode Successful Response
     * @throws ApiError
     */
    public static getEpisodesApiV1EpisodesGet(
        page: number = 1,
    ): CancelablePromise<Array<TitleEpisode>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/episodes',
            query: {
                'page': page,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Next Episode
     * @param episodeId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getNextEpisodeApiV1EpisodesEpisodeIdNextGet(
        episodeId: string,
    ): CancelablePromise<(TitleEpisode | null)> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/episodes/{episode_id}/next',
            path: {
                'episode_id': episodeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Set Episode Progress
     * @param episodeId
     * @param progress
     * @param time
     * @returns void
     * @throws ApiError
     */
    public static setEpisodeProgressApiV1EpisodesEpisodeIdProgressPost(
        episodeId: string,
        progress: number,
        time: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/episodes/{episode_id}/progress',
            path: {
                'episode_id': episodeId,
            },
            query: {
                'progress': progress,
                'time': time,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unset Episode Progress
     * @param episodeId
     * @returns void
     * @throws ApiError
     */
    public static unsetEpisodeProgressApiV1EpisodesEpisodeIdProgressDelete(
        episodeId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/episodes/{episode_id}/progress',
            path: {
                'episode_id': episodeId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
