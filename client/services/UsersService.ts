/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_update_user_me_image_api_v1_users_me_image_put } from '../models/Body_update_user_me_image_api_v1_users_me_image_put';
import type { ImageInfo } from '../models/ImageInfo';
import type { UserRead } from '../models/UserRead';
import type { UserUpdate } from '../models/UserUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get Me
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static getMeApiV1UsersMeGet(): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/me',
        });
    }
    /**
     * Update Me
     * @param requestBody
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static updateMeApiV1UsersMePut(
        requestBody: UserUpdate,
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User Me Image
     * @param formData
     * @returns ImageInfo Successful Response
     * @throws ApiError
     */
    public static updateUserMeImageApiV1UsersMeImagePut(
        formData: Body_update_user_me_image_api_v1_users_me_image_put,
    ): CancelablePromise<ImageInfo> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/users/me/image',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User Me Image
     * @returns void
     * @throws ApiError
     */
    public static deleteUserMeImageApiV1UsersMeImageDelete(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/me/image',
        });
    }
}
