<template>
    <div class="avatar-container">
        <div class="avatar" @click="openModal">
            <img
                src="https://cdn.dribbble.com/users/7924768/avatars/small/c3500eb7d5e9dcfc014ba324d1d7fb01.jpg?1653814588"
                alt=""
            />
        </div>
        <div class="edit">
            <Icon name="material-symbols:edit" />
        </div>
        <ModalDialog
            v-model:active="modalOpened"
            :padding="10"
            off-outside-click-close
        >
            <SelectFile is-picture v-model="file" v-if="!cropAvatarReady" />
            <CropAvatar
                v-if="avatarUrl"
                v-model="avatarUrl"
                @ready="cropAvatarReady = true"
            />
            <template v-slot:buttons="{ closeModal }">
                <Button
                    @click="cropAvatarReady ? reset() : closeModal()"
                    :border-radius="10"
                    :highlight-active="cropAvatarReady"
                >
                    {{ cropAvatarReady ? "Назад" : "Отмена" }}
                </Button>
                <Button
                    :border-radius="10"
                    highlight-active
                    v-if="cropAvatarReady"
                >
                    Сохранить
                </Button>
            </template>
        </ModalDialog>
    </div>
</template>
<script setup>
const modalOpened = ref(false);
const cropAvatarReady = ref(false);
const file = ref(null);

const openModal = () => {
    modalOpened.value = true;
};

const reset = () => {
    file.value = null;
    cropAvatarReady.value = false;
};

const avatarUrl = computed(() => {
    if (!file.value) return;
    return URL.createObjectURL(file.value);
});

watch(modalOpened, (value) => {
    if (!value) {
        reset();
    }
});
</script>
<style lang="scss">
.avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        &:hover {
            &::after {
                opacity: 1;
            }
        }
        &::after {
            content: "Изменить аватар";
            position: absolute;
            inset: 0;
            @include flex-center;
            color: $primary-text;
            text-align: center;
            font-size: 14px;
            background-color: rgba(0, 0, 0, 0.7);
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
        }
    }
    &:has(.avatar:hover) .edit {
        background-color: $accent-hover;
    }
    .edit {
        @include flex-center;
        position: absolute;
        top: 75%;
        right: 30%;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background-color: $accent;
        font-size: 14px;
        font-weight: 500;
    }
}
</style>
