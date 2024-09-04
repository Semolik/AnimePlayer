/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FavoriteTitle } from '../models/FavoriteTitle';
import type { SearchTitle } from '../models/SearchTitle';
import type { Title } from '../models/Title';
import type { TitleEpisodes } from '../models/TitleEpisodes';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TitlesService {
    /**
     * Get Favorite Titles
     * @param page
     * @returns FavoriteTitle Successful Response
     * @throws ApiError
     */
    public static getFavoriteTitlesApiV1TitlesFavoritesGet(
        page: number = 1,
    ): CancelablePromise<Array<FavoriteTitle>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/titles/favorites',
            query: {
                'page': page,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Favorite Title
     * @param titleId
     * @returns void
     * @throws ApiError
     */
    public static favoriteTitleApiV1TitlesFavoritesTitleIdPost(
        titleId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/titles/favorites/{title_id}',
            path: {
                'title_id': titleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Unfavorite Title
     * @param titleId
     * @returns void
     * @throws ApiError
     */
    public static unfavoriteTitleApiV1TitlesFavoritesTitleIdDelete(
        titleId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/titles/favorites/{title_id}',
            path: {
                'title_id': titleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Search Titles
     * @param query
     * @returns SearchTitle Successful Response
     * @throws ApiError
     */
    public static searchTitlesApiV1TitlesSearchGet(
        query: string,
    ): CancelablePromise<Array<SearchTitle>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/titles/search',
            query: {
                'query': query,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Titles Stats
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTitlesStatsApiV1TitlesStatsGet(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/titles/stats',
        });
    }
    /**
     * Get Popular Titles
     * @returns SearchTitle Successful Response
     * @throws ApiError
     */
    public static getPopularTitlesApiV1TitlesPopularGet(): CancelablePromise<Array<SearchTitle>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/titles/popular',
        });
    }
    /**
     * Get Title
     * @param titleId
     * @returns Title Successful Response
     * @throws ApiError
     */
    public static getTitleApiV1TitlesTitleIdGet(
        titleId: string,
    ): CancelablePromise<Title> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/titles/{title_id}',
            path: {
                'title_id': titleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Episodes
     * @param titleId
     * @returns TitleEpisodes Successful Response
     * @throws ApiError
     */
    public static getEpisodesApiV1TitlesTitleIdEpisodesGet(
        titleId: string,
    ): CancelablePromise<TitleEpisodes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/titles/{title_id}/episodes',
            path: {
                'title_id': titleId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
