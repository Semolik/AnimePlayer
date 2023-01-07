<template>
    <LoginContiner :welcome="true">
        <FormInput
            v-model="email"
            label="Почта"
            placeholder="Введите e-mail"
            v-model:wrong="wrongEmail"
            type="email"
        />
        <FormInputPassword v-model="password" v-model:wrong="isWrong" />
        <Button @clicked="handleSignUp" :active="!isWrong" highlight-active>
            Зарегистрироваться
        </Button>
        <div :class="['wait-wrapper', { active: showWait }]">
            <div class="wait-container">
                <div class="wait-title">Подтвердите почту</div>
                <div class="wait-description">
                    Мы отправили письмо на вашу почту, перейдите по ссылке в
                    письме для завершения регистрации
                </div>
            </div>
        </div>
    </LoginContiner>
</template>
<script setup>
import { useToast } from "vue-toastification";
definePageMeta({
    title: "Вход",
    description: "Вход в систему",
    middleware: ["authorized"],
});
const toast = useToast();
const supabase = useSupabaseClient();

const showWait = ref(false);
const email = ref("");
const password = ref("");
const wrongEmail = ref(false);
const isWrong = ref(true);
const handleSignUp = async () => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });
        if (error) throw error;
        console.log(data);
        showWait.value = true;
    } catch (error) {
        toast.error(error.error_description || error.message);
    }
};
</script>
<style lang="scss">
.wait-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    @include flex-center;
    background-color: $secondary-2-bg;
    padding: 20px;
    &.active {
        opacity: 1;
        z-index: 1;
    }
    .wait-container {
        .wait-title {
            font-size: 1.5rem;
            font-weight: 500;
            line-height: 1.75rem;
            margin-bottom: 60px;
            text-align: center;
            color: $primary-text;
        }
        .wait-description {
            color: $secondary-text;
            text-align: center;
        }
    }
}
</style>
