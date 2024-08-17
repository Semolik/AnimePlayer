module.exports = {
    apps: [
        {
            name: "anime-player-v2",
            port: "5000",
            node_args: "-r dotenv/config",
            script: "./.output/server/index.mjs",
        },
    ],
};
