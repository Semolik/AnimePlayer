<template>
    <div class="links">
        <nuxt-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="link"
        >
            <Icon :name="link.icon" />
            <span>{{ link.title }}</span>
        </nuxt-link>
    </div>
</template>
<script setup lang="ts">
interface MenuLink {
    title: string;
    icon: string;
    to: string;
}

defineProps({
    links: {
        type: Array as PropType<MenuLink[]>,
        required: true,
    },
});
</script>

<style lang="scss" scoped>
.links {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    .link {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 5px;
        align-items: center;
        padding: 20px;
        font-size: 17px;
        border-radius: 10px;
        background-color: $tertiary-bg;
        color: $secondary-text;

        svg {
            width: 30px;
            height: 30px;
        }
        &:hover {
            background-color: $quaternary-bg;
            .link-content span {
                color: $primary-text;
            }
        }
    }
}
</style>
