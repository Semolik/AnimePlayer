<template>
    <div class="avatar-container">
        <div class="avatar">
            <img
                src="https://cdn.dribbble.com/users/7924768/avatars/small/c3500eb7d5e9dcfc014ba324d1d7fb01.jpg?1653814588"
                alt=""
            />
            <input type="file" />
            <div class="edit"></div>
            <div class="delete"></div>
        </div>
    </div>
</template>
<script setup></script>
<style lang="scss">
.avatar-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
        }
        .edit {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            color: $primary-text;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }
        }
        .delete {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            color: $primary-text;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            &:hover {
                background-color: rgba(0, 0, 0, 0.7);
            }
        }
    }
}
</style>
