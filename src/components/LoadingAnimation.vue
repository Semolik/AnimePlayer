<template>
    <div class="loading"></div>
</template>
<style scoped>
.loading {
    display: inline-block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
}

.loading:after {
    content: " ";
    display: block;
    width: 40px;
    height: 40px;
    margin: 8px;
    border-radius: 50%;
    border: 4px solid black;
    border-color: black transparent black transparent;
    animation: loading 1.2s linear infinite;
}

@keyframes loading {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>