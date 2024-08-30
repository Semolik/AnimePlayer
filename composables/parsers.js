import { useAppDataStore } from "@/stores/data";
const getParser = (id) => {
    const { parsers } = storeToRefs(useAppDataStore());
    return parsers.value.find((parser) => parser.id === id);
};
export { getParser };
