<template>
    <div class="mobile-menu">
        <nuxt-link class="profile" to="/profile" v-if="logined">
            <img
                :src="userData.image"
                alt="avatar"
                v-if="userData && userData.image"
            />
            <template v-else>
                <div class="avatar">
                    <Icon name="material-symbols:person-outline" />
                </div>
            </template>
            <div class="info">
                {{ userData.name || userData.email }}
            </div>
            <Icon name="material-symbols:chevron-right" class="chevron" />
        </nuxt-link>
        <nuxt-link class="login" to="/login" v-else>
            <span> Войти в аккаунт </span>
            <Icon name="material-symbols:login" />
        </nuxt-link>
        <menu-links :links="links" />
        <div class="login mt-auto" v-if="logined">
            <span> Выйти </span>
            <Icon name="material-symbols:logout" />
        </div>
    </div>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { logined, userData } = storeToRefs(authStore);
const links = [
    { title: "Избранное", icon: "ph:heart-fill", to: "/favorites" },
    { title: "История", icon: "material-symbols:history", to: "/history" },
];
const logout = async () => {
    router.push("/login").then(async () => {
        await authStore.logout();
    });
};
</script>
<style lang="scss" scoped>
.mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    padding-bottom: 0px;
    height: 100%;
    .profile {
        @include flex-center;
        gap: 10px;
        padding: 10px;
        padding-right: 5px;
        border-radius: 10px;
        background-color: $tertiary-bg;
        img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 5px;
        }
        .avatar {
            width: 60px;
            height: 60px;
            border-radius: 5px;
            @include flex-center;
            background-color: $secondary-bg;

            svg {
                width: 25px;
                height: 25px;
            }
        }

        .info {
            flex: 1;
            text-align: center;
        }

        .chevron {
            width: 25px;
            color: $secondary-text;
            height: 25px;
        }
    }

    .login {
        background-color: $tertiary-bg;
        color: $secondary-text;
        padding: 10px;
        border-radius: 10px;
        gap: 5px;
        @include flex-center;
        span {
            margin-bottom: 3px;
        }
    }
}
</style>
