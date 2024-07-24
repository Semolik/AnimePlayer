<template>
    {{ title }}
</template>
<script setup>
import { TitlesService } from "~/client";
const route = useRoute();
const siteConfig = useSiteConfig();
const { title_id } = route.params;
const title = await TitlesService.getTitleApiV1TitlesTitleIdGet(title_id);
useSeoMeta({
    title: title.name,
    description: title.description,
});
defineOgImageComponent("title", {
    title: title.name,
    image: title.image_url,
    description: title.description,
    link: new URL(siteConfig.url).host,
});
</script>
