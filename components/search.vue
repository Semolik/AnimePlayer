<template>
    <UCommandPalette
        :groups="groups"
        ref="commandPaletteRef"
        placeholder="Введите название тайтла или жанра"
        @update:model-value="onSelect"
        :autoselect="false"
        :autoclear="false"
        :loading="loading"
        :model-value="[]"
        multiple
        :ui="{
            wrapper:
                'flex flex-col flex-1 min-h-0 divide-y divide-gray-100 dark:divide-gray-800 sm:min-h-[50vh] sm:max-h-[50vh]',

            group: {
                command: {
                    base: 'flex justify-between select-none items-center rounded-md px-2.5 py-2.5 gap-2 relative',
                    inactive: 'text-gray-500',
                },
            },
        }"
    >
        <template #empty-state>
            <div
                class="flex flex-col items-center justify-center py-6 gap-3 sm:h-[40vh]"
            >
                <span class="text-md">Ничего не найдено</span>
            </div>
        </template>

        <template #titles-command="{ command }">
            <span class="title-name">{{ command.label }}</span>
            <Icon name="material-symbols:arrow-forward-ios-rounded" />
            <splitted-names
                :names="command.parsers.map((parser) => parser.name)"
            />
        </template>
        <template #genres-command="{ command }">
            <span>{{ command.label }}</span>
            <Icon name="material-symbols:arrow-forward-ios-rounded" />
            <splitted-names
                :names="command.genre.variants.map((variant) => variant.name)"
            />
        </template>
    </UCommandPalette>
    <select-parser
        :variants="selectedVariants"
        v-model:active="selectParserActive"
        @select="onSelectParser"
    />
</template>
<script setup>
import { TitlesService } from "~/client";
const emit = defineEmits(["close"]);
const router = useRouter();
const selectedVariants = ref([]);
const selectParserActive = ref(false);
const onSelectParser = (parserOption) => {
    emit("close");
    selectParserActive.value = false;
    router.push(parserOption.link);
};
const onSelect = (options) => {
    let option = options[0];
    if (option.group === "titles") {
        if (option.title.on_other_parsers.length === 1) {
            emit("close");
            router.push(`/titles/${option.title.on_other_parsers[0].id}`);
            return;
        }
        selectedVariants.value = option.title.on_other_parsers.map((title) => ({
            link: `/titles/${title.id}`,
            parser_id: title.parser_id,
        }));
        console.log(selectedVariants.value);
        selectParserActive.value = true;
    } else if (option.group === "genres") {
        if (option.genre.variants.length === 1) {
            emit("close");
            router.push({
                name: "parser",
                query: {
                    genre_id: option.genre.variants[0].id,
                },
            });
            return;
        }
        selectedVariants.value = option.genre.variants.map((variant) => ({
            link: `/parser?genre_id=${variant.id}`,
            parser_id: variant.parser_id,
        }));
        selectParserActive.value = true;
    }
};
const commandPaletteRef = ref(null);
const loading = ref(false);
const { genres: allGenres } = storeToRefs(useAppDataStore());
const genresData = ref(allGenres);
const genres = computed(() =>
    genresData.value.map((genre, index) => ({
        id: index,
        label: genre.name,
        genre: {
            ...genre,
            variants: genre.variants.map((variant) => ({
                ...variant,
                name: getParser(variant.parser_id).name,
            })),
        },
    }))
);

const groups = ref([]);
watch(
    () => commandPaletteRef.value?.query,
    async (q) => {
        if (q) {
            loading.value = true;
            const titles = await TitlesService.searchTitlesApiV1TitlesSearchGet(
                q
            );

            loading.value = false;
            var result = [
                {
                    label: "Поиск по тайтлам",
                    key: "titles",
                    commands: titles.map((title, index) => ({
                        id: index,
                        label: title.name,
                        parsers: title.on_other_parsers.map((title) =>
                            getParser(title.parser_id)
                        ),
                        title: title,
                    })),
                },
            ];
            var filteredGenres = genres.value.filter((genre) =>
                genre.label.toLowerCase().includes(q.toLowerCase())
            );
            if (filteredGenres.length) {
                let last_index = result[0].commands.length;
                result.push({
                    label: "Доступные жанры",
                    key: "genres",
                    commands: (filteredGenres.length > 5
                        ? filteredGenres.slice(0, 5)
                        : filteredGenres
                    ).map((genre) => ({
                        ...genre,
                        id: last_index++,
                    })),
                });
            }
            groups.value = result;
        } else {
            groups.value = [
                {
                    label: "Доступные жанры",
                    key: "genres",
                    commands: genres,
                },
            ];
        }
    },
    { immediate: true }
);
</script>
<style lang="scss" scoped>
.title-name {
    @include cut-text;
}
</style>
