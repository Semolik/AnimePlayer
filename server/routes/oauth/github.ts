import { AuthService, OpenAPI } from "@/client";
import axios from "axios";

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    OpenAPI.BASE = runtimeConfig.apiLocalUrl;
    const { authorization_url } =
        await AuthService.oauthGithubJwtAuthorizeApiV1AuthGithubAuthorizeGet();

    await sendRedirect(event, authorization_url, 302);
});
