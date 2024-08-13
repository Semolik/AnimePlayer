/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Episode } from './Episode';
import type { Genre } from './Genre';
import type { ShikimoriTitle } from './ShikimoriTitle';
import type { TitleLink } from './TitleLink';
import type { TitleShort } from './TitleShort';
export type Title = {
    id: string;
    name: string;
    parser_id: string;
    image_url: string;
    additional_info?: string;
    en_name?: (string | null);
    description?: (string | null);
    series_info?: (string | null);
    year?: (string | null);
    liked?: boolean;
    current_episode?: (Episode | null);
    genres?: Array<Genre>;
    episodes?: Array<Episode>;
    related?: Array<TitleLink>;
    recommended?: Array<TitleShort>;
    shikimori?: (ShikimoriTitle | null);
    shikimori_failed?: boolean;
    duration?: (string | null);
    episodes_message?: (string | null);
};

