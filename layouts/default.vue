<template>
    <NuxtLoadingIndicator />
    <div class="default-layout">
        <aside>
            <nuxt-link to="/" class="mobile">
                <Icon name="material-symbols:home" class="active" />
                <Icon name="material-symbols:home-outline" class="default" />
            </nuxt-link>
            <nuxt-link to="/search" class="mobile">
                <Icon name="material-symbols:search" />
            </nuxt-link>
            <nuxt-link to="/favorites">
                <Icon name="ph:heart-fill" class="active" />
                <Icon name="ph:heart" class="default" />
            </nuxt-link>
            <nuxt-link to="/history">
                <Icon name="material-symbols:history" />
            </nuxt-link>

            <nuxt-link class="menu" to="/mobile-menu">
                <Icon name="material-symbols:menu" />
            </nuxt-link>
            <nuxt-link class="login" to="/profile/edit" v-if="userData">
                <img
                    :src="userData.image"
                    alt="avatar"
                    v-if="userData?.image"
                />
                <template v-else>
                    <Icon name="material-symbols:person" class="active" />
                    <Icon
                        name="material-symbols:person-outline"
                        class="default"
                    />
                </template>
            </nuxt-link>
            <nuxt-link class="login" to="/login" v-else>
                <Icon name="material-symbols:login" />
            </nuxt-link>
        </aside>
        <div class="app-content">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { logined, userData } = storeToRefs(authStore);
</script>
<style lang="scss">
.default-layout {
    display: flex;
    min-height: 100%;

    & > aside {
        @include flex-center;
        background-color: $secondary-bg;
        position: fixed;
        height: 100%;
        padding: 20px;
        gap: 15px;
        z-index: 100;
        @include sm {
            flex-direction: column;
            width: 85px;
        }

        @include sm(true) {
            justify-content: space-between;
            padding: 10px;
            width: 100%;
            height: 60px;
            bottom: 0;
        }
        .login {
            overflow: hidden;
            img {
                height: 100%;
                width: 100%;
                object-fit: cover;
            }
        }
        .menu,
        .login,
        a {
            @include flex-center;
            width: 45px;
            height: 45px;
            border-radius: 10px;
            background-color: transparent;
            cursor: pointer;
            @include sm(true) {
                width: 100%;
                &:not(.mobile) {
                    display: none;
                }
                &.menu {
                    display: flex;
                }
            }

            &.router-link-active {
                @include sm {
                }
                background-color: $tertiary-bg;
                svg {
                    color: $accent;
                    &.default {
                        display: none;
                    }
                }
            }
            &:not(.router-link-active) {
                svg {
                    color: $tertiary-text;
                    &.active {
                        display: none;
                    }
                }
            }
            @include sm {
                &:hover {
                    background-color: $tertiary-bg;
                }
                &.menu {
                    display: none;
                }
            }
            svg {
                width: 25px;
                height: 25px;
                color: $accent;
                transition: color 0s;
            }
            &.login {
                margin-top: auto;
            }
        }
    }
    .app-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;

        @include sm {
            margin-left: 85px;
        }
        @include md(true) {
            min-height: 100%;
        }

        @include sm(true) {
            padding: 0px;
            padding-bottom: 70px;
        }
    }
}
</style>
