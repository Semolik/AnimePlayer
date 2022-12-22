<template>
    <div class="login-container-wrapper">
        <div class="login-container">
            <slot></slot>
        </div>
    </div>
</template>
<style lang="scss">
.login-container-wrapper {
    height: 100%;
    width: 100%;
    @include flex-center;
    .login-container {
        background-color: $secondary-bg;
        max-width: 800px;
        width: 100%;
        min-height: 50vh;
        box-shadow: $primary-box-shadow;
    }
}
</style>
