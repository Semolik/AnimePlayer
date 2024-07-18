<template>
    <selection-page>
        <template #aside>
            <selection-link to="/profile" icon="material-symbols:person">
                Информация
            </selection-link>
            <selection-link
                to="/profile/integrations"
                icon="carbon:ibm-cloud-direct-link-1-connect"
            >
                Интеграции
            </selection-link>
        </template>
        <NuxtPage />
    </selection-page>
</template>
<script setup>
definePageMeta({
    middleware: ["auth"],
});
</script>
