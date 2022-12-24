<template>
    <div class="default-layout">
        <aside>
            <nuxt-link to="/" class="mobile">
                <Icon name="material-symbols:home" class="active" />
                <Icon name="material-symbols:home-outline" class="default" />
            </nuxt-link>
            <nuxt-link to="/search" class="mobile">
                <Icon name="material-symbols:search" />
            </nuxt-link>
            <nuxt-link to="/favorites" class="mobile">
                <Icon name="ph:heart-fill" class="active" />
                <Icon name="ph:heart" class="default" />
            </nuxt-link>
            <nuxt-link to="/history">
                <Icon name="material-symbols:history" />
            </nuxt-link>
            <nuxt-link to="/settings">
                <Icon name="material-symbols:settings" class="active" />
                <Icon
                    name="material-symbols:settings-outline"
                    class="default"
                />
            </nuxt-link>
            <nuxt-link class="menu" to="/mobile-menu">
                <Icon name="material-symbols:menu" />
            </nuxt-link>
            <nuxt-link class="login" to="/login">
                <Icon name="material-symbols:logout" />
            </nuxt-link>
        </aside>
        <div class="app-content">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="scss">
.default-layout {
    display: flex;
    height: 100%;
    @include sm(true) {
        flex-direction: column-reverse;
    }
    aside {
        background-color: $secondary-bg;
        padding: 20px;
        display: flex;
        gap: 15px;
        @include sm {
            flex-direction: column;
        }
        @include sm(true) {
            justify-content: space-between;
            padding: 20px 30px;
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
                &:not(.mobile) {
                    display: none;
                }
                &.menu {
                    display: flex;
                }
            }

            &.router-link-exact-active {
                @include sm {
                    background-color: $tertiary-bg;
                }
                svg {
                    color: $primary-text;
                    &.default {
                        display: none;
                    }
                }
            }
            &:not(.router-link-exact-active) {
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
                color: $primary-text;
                transition: color 0s;
            }
            &.login {
                margin-top: auto;
            }
        }
    }
    .app-content {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
    }
}
</style>
