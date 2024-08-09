<template>
    <LoginContainer>
        <login @login="handleLogin" />
    </LoginContainer>
</template>
<script setup>
const handleLogin = async () => {
    const router = useRouter();
    router.push("/");
};
</script>
