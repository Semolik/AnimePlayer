/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_auth_jwt_login_api_v1_auth_jwt_login_post } from '../models/Body_auth_jwt_login_api_v1_auth_jwt_login_post';
import type { Body_reset_forgot_password_api_v1_auth_forgot_password_post } from '../models/Body_reset_forgot_password_api_v1_auth_forgot_password_post';
import type { Body_reset_reset_password_api_v1_auth_reset_password_post } from '../models/Body_reset_reset_password_api_v1_auth_reset_password_post';
import type { Body_verify_request_token_api_v1_auth_request_verify_token_post } from '../models/Body_verify_request_token_api_v1_auth_request_verify_token_post';
import type { Body_verify_verify_api_v1_auth_verify_post } from '../models/Body_verify_verify_api_v1_auth_verify_post';
import type { ChangePassword } from '../models/ChangePassword';
import type { OAuth2AuthorizeResponse } from '../models/OAuth2AuthorizeResponse';
import type { UserCreate } from '../models/UserCreate';
import type { UserRead } from '../models/UserRead';
import type { UserReadAfterRegister } from '../models/UserReadAfterRegister';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Auth:Jwt.Login
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static authJwtLoginApiV1AuthJwtLoginPost(
        formData: Body_auth_jwt_login_api_v1_auth_jwt_login_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/jwt/login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Auth:Jwt.Logout
     * @returns any Successful Response
     * @throws ApiError
     */
    public static authJwtLogoutApiV1AuthJwtLogoutPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/jwt/logout',
            errors: {
                401: `Missing token or inactive user.`,
            },
        });
    }
    /**
     * Reset:Forgot Password
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resetForgotPasswordApiV1AuthForgotPasswordPost(
        requestBody: Body_reset_forgot_password_api_v1_auth_forgot_password_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reset:Reset Password
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resetResetPasswordApiV1AuthResetPasswordPost(
        requestBody: Body_reset_reset_password_api_v1_auth_reset_password_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Verify:Request-Token
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static verifyRequestTokenApiV1AuthRequestVerifyTokenPost(
        requestBody: Body_verify_request_token_api_v1_auth_request_verify_token_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/request-verify-token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Verify:Verify
     * @param requestBody
     * @returns UserReadAfterRegister Successful Response
     * @throws ApiError
     */
    public static verifyVerifyApiV1AuthVerifyPost(
        requestBody: Body_verify_verify_api_v1_auth_verify_post,
    ): CancelablePromise<UserReadAfterRegister> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Register:Register
     * @param requestBody
     * @returns UserReadAfterRegister Successful Response
     * @throws ApiError
     */
    public static registerRegisterApiV1AuthRegisterPost(
        requestBody: UserCreate,
    ): CancelablePromise<UserReadAfterRegister> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth:Google.Jwt.Authorize
     * @param scopes
     * @returns OAuth2AuthorizeResponse Successful Response
     * @throws ApiError
     */
    public static oauthGoogleJwtAuthorizeApiV1AuthGoogleAuthorizeGet(
        scopes?: Array<string>,
    ): CancelablePromise<OAuth2AuthorizeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/google/authorize',
            query: {
                'scopes': scopes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth:Google.Jwt.Callback
     * The response varies based on the authentication backend used.
     * @param code
     * @param codeVerifier
     * @param state
     * @param error
     * @returns any Successful Response
     * @throws ApiError
     */
    public static oauthGoogleJwtCallbackApiV1AuthGoogleCallbackGet(
        code?: (string | null),
        codeVerifier?: (string | null),
        state?: (string | null),
        error?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/google/callback',
            query: {
                'code': code,
                'code_verifier': codeVerifier,
                'state': state,
                'error': error,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth-Associate:Google.Authorize
     * @param scopes
     * @returns OAuth2AuthorizeResponse Successful Response
     * @throws ApiError
     */
    public static oauthAssociateGoogleAuthorizeApiV1AuthAssociateGoogleAuthorizeGet(
        scopes?: Array<string>,
    ): CancelablePromise<OAuth2AuthorizeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/associate/google/authorize',
            query: {
                'scopes': scopes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth-Associate:Google.Callback
     * The response varies based on the authentication backend used.
     * @param code
     * @param codeVerifier
     * @param state
     * @param error
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static oauthAssociateGoogleCallbackApiV1AuthAssociateGoogleCallbackGet(
        code?: (string | null),
        codeVerifier?: (string | null),
        state?: (string | null),
        error?: (string | null),
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/associate/google/callback',
            query: {
                'code': code,
                'code_verifier': codeVerifier,
                'state': state,
                'error': error,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth:Github.Jwt.Authorize
     * @param scopes
     * @returns OAuth2AuthorizeResponse Successful Response
     * @throws ApiError
     */
    public static oauthGithubJwtAuthorizeApiV1AuthGithubAuthorizeGet(
        scopes?: Array<string>,
    ): CancelablePromise<OAuth2AuthorizeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/github/authorize',
            query: {
                'scopes': scopes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth:Github.Jwt.Callback
     * The response varies based on the authentication backend used.
     * @param code
     * @param codeVerifier
     * @param state
     * @param error
     * @returns any Successful Response
     * @throws ApiError
     */
    public static oauthGithubJwtCallbackApiV1AuthGithubCallbackGet(
        code?: (string | null),
        codeVerifier?: (string | null),
        state?: (string | null),
        error?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/github/callback',
            query: {
                'code': code,
                'code_verifier': codeVerifier,
                'state': state,
                'error': error,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Github Callback Redirection
     * @returns void
     * @throws ApiError
     */
    public static githubCallbackRedirectionApiV1AuthGithubCallbackRedirectGet(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/github/callback/redirect',
            errors: {
                307: `Successful Response`,
            },
        });
    }
    /**
     * Oauth-Associate:Github.Authorize
     * @param scopes
     * @returns OAuth2AuthorizeResponse Successful Response
     * @throws ApiError
     */
    public static oauthAssociateGithubAuthorizeApiV1AuthAssociateGithubAuthorizeGet(
        scopes?: Array<string>,
    ): CancelablePromise<OAuth2AuthorizeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/associate/github/authorize',
            query: {
                'scopes': scopes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth-Associate:Github.Callback
     * The response varies based on the authentication backend used.
     * @param code
     * @param codeVerifier
     * @param state
     * @param error
     * @returns UserRead Successful Response
     * @throws ApiError
     */
    public static oauthAssociateGithubCallbackApiV1AuthAssociateGithubCallbackGet(
        code?: (string | null),
        codeVerifier?: (string | null),
        state?: (string | null),
        error?: (string | null),
    ): CancelablePromise<UserRead> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/associate/github/callback',
            query: {
                'code': code,
                'code_verifier': codeVerifier,
                'state': state,
                'error': error,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Change Password
     * Изменение пароля пользователя
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static changePasswordApiV1AuthChangePasswordPut(
        requestBody: ChangePassword,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
