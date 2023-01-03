<template>
    <div class="login-container-wrapper">
        <div class="login-container">
            <div class="welcome-text">
                <div class="headline">{{ welcomeText }}</div>
                <div class="description">
                    Введите свои данные для
                    {{ welcome ? "регистрации" : "входа" }}
                </div>
            </div>
            <div class="form">
                <slot></slot>
            </div>
            <router-link :to="welcome ? '/login' : '/sign-in'" class="link">
                {{ welcome ? "Уже есть аккаунт?" : "Нет аккаунта?" }}
            </router-link>
        </div>
    </div>
</template>
<script setup>
const { welcome } = defineProps({
    welcome: {
        type: Boolean,
        default: false,
    },
});
const welcomeText = ref(welcome ? "Добро пожаловать" : "Войти в систему");
</script>
<style lang="scss" scoped>
.login-container-wrapper {
    height: 100%;
    width: 100%;
    @include flex-center;
    flex-direction: column;
    .login-container {
        max-width: 400px;
        width: 100%;
        display: flex;
        flex-direction: column;
        .welcome-text {
            padding: 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 10px;
            text-align: center;
            .headline {
                font-size: 1.25rem;
                line-height: 1.75rem;
                color: $primary-text;
            }
            .description {
                font-size: 14px;
                color: $secondary-text;
            }
        }

        .form {
            background-color: $secondary-bg;
            box-shadow: $primary-box-shadow;
            padding: 15px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 10px;
        }

        .link {
            border-radius: 10px;
            font-size: 14px;

            color: $tertiary-text;
            text-decoration: none;
            cursor: pointer;
            padding: 10px;
            // background-color: $secondary-bg;
            text-align: center;

            &:hover {
                box-shadow: $primary-box-shadow;
                background-color: $secondary-bg;
                color: $secondary-text;
            }
        }
    }
}
</style>
