/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseMessage } from '../models/BaseMessage';
import type { Message } from '../models/Message';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MessagesService {
    /**
     * Get Messages
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static getMessagesApiV1MessagesGet(): CancelablePromise<Array<Message>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/messages',
        });
    }
    /**
     * Create Message
     * @param requestBody
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static createMessageApiV1MessagesPost(
        requestBody: BaseMessage,
    ): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/messages',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Message
     * @param messageId
     * @param requestBody
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static updateMessageApiV1MessagesMessageIdPut(
        messageId: string,
        requestBody: BaseMessage,
    ): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/messages/{message_id}',
            path: {
                'message_id': messageId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Message
     * @param messageId
     * @returns void
     * @throws ApiError
     */
    public static deleteMessageApiV1MessagesMessageIdDelete(
        messageId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/messages/{message_id}',
            path: {
                'message_id': messageId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
