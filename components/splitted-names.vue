<template>
    <div class="flex items-center">
        <span>{{ names[0] }}</span>
        <template v-if="names.length > 1">
            <template v-for="name in names.slice(1)">
                <Icon name="ph:line-vertical-bold" class="text-gray-500" />
                <span>{{ name }}</span>
            </template>
        </template>
    </div>
</template>
<script setup lang="ts">
defineProps({
    names: {
        type: Array as PropType<string[]>,
        required: true,
    },
});
</script>
