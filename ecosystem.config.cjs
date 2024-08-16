module.exports = {
    apps: [
        {
            name: "anime-player-v2",
            port: "5000",
            exec_mode: "cluster",
            instances: "max",
            script: "./.output/server/index.mjs",
        },
    ],
};
