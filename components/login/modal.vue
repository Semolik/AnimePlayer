<template>
    <modal-dialog
        v-model:active="active"
        :max-width="400"
        :padding="20"
        headline="Вход"
    >
        <div class="modal-content">
            <login @login="active = false" />
            <auth-with-provider />
        </div>
    </modal-dialog>
</template>
<script setup>
const props = defineProps({
    active: {
        type: Boolean,
        required: true,
    },
});
const emit = defineEmits(["update:active"]);
const active = computed({
    get: () => props.active,
    set: (value) => emit("update:active", value),
});
</script>
<style scoped lang="scss">
.modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 200px;
}
</style>
