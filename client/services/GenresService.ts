/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TitlesPage } from '../models/TitlesPage';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GenresService {
    /**
     * Get Genre
     * @param genreId
     * @param page
     * @returns TitlesPage Successful Response
     * @throws ApiError
     */
    public static getGenreApiV1GenresGenresGenreIdGet(
        genreId: string,
        page: number = 1,
    ): CancelablePromise<TitlesPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/genres/genres/{genre_id}',
            path: {
                'genre_id': genreId,
            },
            query: {
                'page': page,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
