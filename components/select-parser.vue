<template>
    <modal-dialog v-model:active="modalActive" headline="Выберите парсер">
        <div class="grid grid-cols-2 mt-3 gap-2">
            <UButton
                color="primary"
                variant="outline"
                size="lg"
                class="text-base grow flex justify-center"
                v-for="link in links"
                @click="() => emit('select', link)"
            >
                {{ link.name }}
            </UButton>
        </div>
    </modal-dialog>
</template>
<script setup lang="ts">
interface Variant {
    link: string;
    parser_id: number;
}
const props = defineProps({
    variants: {
        type: Array as PropType<Variant[]>,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
});
const emit = defineEmits(["update:active", "select"]);
const modalActive = computed({
    get: () => props.active,
    set: (value) => emit("update:active", value),
});
const links = computed(() =>
    props.variants.map((variant) => ({
        ...variant,
        name: getParser(variant.parser_id)?.name,
    }))
);
const router = useRouter();
</script>
