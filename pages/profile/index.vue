<template>
    <div class="profile-container">
        <div class="profile">
            <div class="description">
                В этом разделе вы можете изменить свои персональные данные.
            </div>
            <div class="profile__info_row">
                <Avatar @change="onImageUpdate" :image="image" />
                <div class="profile__info">
                    <FormInput
                        label="Имя"
                        placeholder="Введите имя"
                        v-model="name"
                    />
                    <FormInput
                        label="Почта"
                        placeholder="Введите e-mail"
                        v-model="email"
                        v-model:wrong="wrongEmail"
                        type="email"
                    />
                </div>
            </div>
            <UButton
                block
                size="lg"
                class="mt-auto"
                color="amber"
                :disabled="!buttonActive"
                @click="handleSave"
                :loading="loading"
            >
                Сохранить
            </UButton>
        </div>
    </div>
</template>
<script setup>
import { UsersService } from "~/client";
import { useAuthStore } from "~~/stores/auth";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { userData } = storeToRefs(authStore);
const { $toast } = useNuxtApp();
const email = ref(userData.value.email);
const wrongEmail = ref(false);
const name = ref(userData.value.name);
const image = ref(userData.value.image);
const imageBlob = ref(null);
const onImageUpdate = (file) => {
    imageBlob.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        image.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const dataChanged = computed(() => {
    return (
        email.value !== userData.value.email ||
        name.value !== userData.value.name ||
        imageBlob.value
    );
});
const dataValid = computed(() => {
    return !wrongEmail.value && !!name.value && !!email.value;
});
const buttonActive = computed(() => dataChanged.value && dataValid.value);
const loading = ref(false);
const handleSave = async () => {
    if (!buttonActive.value) return;
    loading.value = true;
    var error = await authStore.updateProfile(email.value, name.value);
    try {
        if (imageBlob.value) {
            await UsersService.updateUserMeImageApiV1UsersMeImagePut({
                userPicture: imageBlob.value,
            });
            imageBlob.value = null;
        }
    } catch (e) {
        error = e;
    }
    loading.value = false;
    if (error) {
        $toast.error(HandleOpenApiError(error).message);
    }
};
</script>
<style lang="scss">
.profile-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .headlines,
    .profile-wrapper {
        display: grid;
        gap: 20px;
        grid-template-columns: 2fr 1fr;
    }

    .profile {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        gap: 20px;
        .description {
            font-size: 14px;
            line-height: 20px;
            color: $secondary-text;
            margin-bottom: 20px;
        }
        .profile__info_row {
            display: flex;
            gap: 10px;

            @include md(true) {
                flex-direction: column;
            }
            .profile__info {
                display: flex;
                flex-direction: column;
                gap: 10px;
                width: 100%;
            }
        }
    }
}
</style>
