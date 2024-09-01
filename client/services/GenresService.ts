/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Genre } from '../models/Genre';
import type { TitlesPage } from '../models/TitlesPage';
import type { UniqueGenre } from '../models/UniqueGenre';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GenresService {
    /**
     * Get Genre
     * @param genreId
     * @returns Genre Successful Response
     * @throws ApiError
     */
    public static getGenreApiV1GenresGenreIdGet(
        genreId: string,
    ): CancelablePromise<Genre> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/genres/{genre_id}',
            path: {
                'genre_id': genreId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Genre Titles
     * @param genreId
     * @param page
     * @returns TitlesPage Successful Response
     * @throws ApiError
     */
    public static getGenreTitlesApiV1GenresGenreIdTitlesGet(
        genreId: string,
        page: number = 1,
    ): CancelablePromise<TitlesPage> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/genres/{genre_id}/titles',
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
    /**
     * Get Genres
     * @returns UniqueGenre Successful Response
     * @throws ApiError
     */
    public static getGenresApiV1GenresGet(): CancelablePromise<Array<UniqueGenre>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/genres',
        });
    }
}
