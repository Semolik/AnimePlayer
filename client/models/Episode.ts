/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ParsedLink } from './ParsedLink';
export type Episode = {
    id: string;
    name: string;
    progress?: number;
    seconds?: number;
    number: number;
    links: Array<ParsedLink>;
    is_m3u8?: boolean;
    image_url?: (string | null);
    duration?: (number | null);
    duration_label?: (string | null);
};

