import axios from "axios";

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig();
    const query = getQuery(event);
    const request = await axios.get(
        runtimeConfig.apiLocalUrl + "/api/v1/auth/github/callback",
        {
            params: query,
        }
    );
    const cookies = request.headers["set-cookie"];
    if (cookies) {
        setCookie(
            event,
            runtimeConfig.authCookieName,
            cookies[0].split(";")[0].split("=")[1]
        );
    }
    await sendRedirect(event, "/");
});
