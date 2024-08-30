<template>
    <LoginContainer>
        <login @login="handleLogin" />
    </LoginContainer>
</template>
<script setup>
definePageMeta({
    title: "Вход",
    description: "Вход в систему",
});
const handleLogin = async () => {
    const router = useRouter();
    router.push("/");
};
</script>
