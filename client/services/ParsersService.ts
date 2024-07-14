/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Genre } from '../models/Genre';
import type { ParserInfo } from '../models/ParserInfo';
import type { TitlesPage } from '../models/TitlesPage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ParsersService {
    /**
     * Get Episode
     * @param linkHash
     * @returns string Successful Response
     * @throws ApiError
     */
    public static getEpisodeApiV1ParsersAnidubEpisodeGet(
        linkHash: string,
    ): CancelablePromise<string> {
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
    /**
     * Get Parsers
     * @returns ParserInfo Successful Response
     * @throws ApiError
     */
    public static getParsersApiV1ParsersGet(): CancelablePromise<Array<ParserInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/parsers',
        });
    }
    /**
     * Get Titles
     * @param parserId
     * @param page
     * @returns TitlesPage Successful Response
     * @throws ApiError
     */
    public static getTitlesApiV1ParsersParserIdTitlesGet(
        parserId: 'anidub' | 'animevost',
        page: number = 1,
    ): CancelablePromise<TitlesPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/parsers/{parser_id}/titles',
            path: {
                'parser_id': parserId,
            },
            query: {
                'page': page,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Main Titles
     * @param parserId
     * @returns TitlesPage Successful Response
     * @throws ApiError
     */
    public static getMainTitlesApiV1ParsersParserIdTitlesMainGet(
        parserId: 'anidub' | 'animevost',
    ): CancelablePromise<TitlesPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/parsers/{parser_id}/titles/main',
            path: {
                'parser_id': parserId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Genres
     * @param parserId
     * @returns Genre Successful Response
     * @throws ApiError
     */
    public static getGenresApiV1ParsersParserIdGenresGet(
        parserId: 'anidub' | 'animevost',
    ): CancelablePromise<Array<Genre>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/parsers/{parser_id}/genres',
            path: {
                'parser_id': parserId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
