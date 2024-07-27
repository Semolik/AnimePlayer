const getParser = (id) => {
    const { $parsers } = useNuxtApp();
    return $parsers.find((parser) => parser.id === id);
};
export { getParser };
