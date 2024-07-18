import { defineStore } from "pinia";
import { AuthService, UsersService, OpenAPI } from "@/client";
import axios from "axios";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        logined: false,
        userData: null,
    }),
    getters: {
        isSuperuser() {
            return this.userData?.is_superuser;
        },
    },
    actions: {
        resetSavedData() {
            this.logined = false;
            this.userData = null;
        },
        async logout() {
            try {
                await AuthService.authJwtLogoutApiV1AuthJwtLogoutPost();
            } catch (error) {}
            this.resetSavedData();
        },
        async getUserData() {
            try {
                if (import.meta.server) {
                    const token = useCookie("fastapiusersauth");
                    const request = await axios.get(
                        `${OpenAPI.BASE}/api/v1/users/me`,
                        {
                            withCredentials: true,
                            headers: {
                                Cookie: `fastapiusersauth=${token.value}`,
                            },
                        }
                    );
                    this.userData = request.data;
                } else {
                    this.userData =
                        await UsersService.getUserMeApiV1UsersMeGet();
                }
                this.logined = true;
            } catch (error) {
                this.resetSavedData();
            }
        },

        async login(username, password) {
            this.logined = false;
            try {
                this.userData =
                    await AuthService.authJwtLoginApiV1AuthJwtLoginPost({
                        username: username,
                        password: password,
                    });
                this.logined = true;
            } catch (error) {
                this.resetSavedData();
                return error;
            }
        },
        async registerRequest(username, password, name) {
            this.logined = false;
            try {
                this.userData =
                    await AuthService.registerRegisterApiV1AuthRegisterPost({
                        username,
                        password,
                        name,
                    });
                this.logined = true;
            } catch (error) {
                this.resetSavedData();
                return error;
            }
        },
    },
});
