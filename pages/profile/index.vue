<template>
    <div class="profile-container">
        <div class="headlines">
            <AsidePageHeadline title="Информация" />
            <AsidePageHeadline title="Фото профиля" />
        </div>
        <div class="profile-wrapper">
            <div class="profile">
                <div class="description">
                    В этом разделе вы можете изменить свои персональные данные.
                </div>
                <div class="profile__info">
                    {{ firstName }}
                    <FormInput label="Имя" placeholder="Введите имя" />
                    <FormInput label="Фамилия" placeholder="Введите фамилию" />
                </div>
            </div>
            <div class="profile-photo">
                <Avatar />
            </div>
        </div>
    </div>
</template>
<script setup>
const user = useSupabaseUser();
console.log(user.value);
// const firstName = ref(user.user_metadata.first_name);
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

    .profile-wrapper {
        width: 100%;
        .profile {
            display: flex;
            flex-direction: column;
            width: 100%;
            .description {
                font-size: 14px;
                line-height: 20px;
                color: $secondary-text;
                margin-bottom: 20px;
            }
            .profile__info {
                display: flex;
                gap: 10px;
                width: 100%;
                height: 100%;
            }
        }
    }
    .profile-photo {
        padding: 10px;
        .profile-photo__title {
            white-space: nowrap;
            font-weight: 500;
            line-height: 24px;
            font-size: 18px;
            color: $secondary-text;
        }
    }
}
</style>
