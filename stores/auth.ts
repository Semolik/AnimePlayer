import { defineStore } from "pinia";
import { AuthService, UsersService, OpenAPI, type UserRead } from "@/client";
import axios from "axios";

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({
        logined: false,
        userData: null as UserRead | null,
    }),
    getters: {
        isSuperuser(): boolean {
            return this.userData?.is_superuser ?? false;
        },
    },
    actions: {
        resetSavedData(): void {
            this.logined = false;
            this.userData = null;
        },
        async logout(): Promise<void> {
            try {
                await AuthService.authJwtLogoutApiV1AuthJwtLogoutPost();
            } catch (error) {}
            this.resetSavedData();
        },
        async getUserData(): Promise<void> {
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
                    this.userData = await UsersService.getMeApiV1UsersMeGet();
                }
                this.logined = true;
            } catch (error) {
                this.resetSavedData();
            }
        },
        async updateProfile(email: string, name: string): Promise<any> {
            try {
                this.userData = await UsersService.updateMeApiV1UsersMePut({
                    email,
                    name,
                });
            } catch (error) {
                return error;
            }
        },
        async login(username: string, password: string): Promise<any> {
            this.logined = false;
            try {
                await AuthService.authJwtLoginApiV1AuthJwtLoginPost({
                    username: username,
                    password: password,
                });
                await this.getUserData();
                this.logined = true;
            } catch (error) {
                this.resetSavedData();
                return error;
            }
        },
        async registerRequest(
            email: string,
            password: string,
            name: string
        ): Promise<any> {
            this.logined = false;
            try {
                this.userData =
                    await AuthService.registerRegisterApiV1AuthRegisterPost({
                        email,
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
