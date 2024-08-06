import { defineStore } from "pinia";
import { type Episode } from "~/client";
import Plyr from "plyr";
import HLS from "hls.js";
export const usePlayerStore = defineStore({
    id: "player",
    state: () => ({
        player: null as Plyr | null,
        video: null as HTMLVideoElement | null,
        isOpen: false,
        currentEpisode: null as Episode | null,
        enterFullscreen: null as (() => void) | null,
        hsl: null as HLS | null,
    }),
    actions: {
        setPlayer(player: Plyr): void {
            this.player = player;
            this.player.on("enterfullscreen", (e) => {
                this.isOpen = true;
            });
            this.player.on("exitfullscreen", (e) => {
                this.isOpen = false;
                player.stop();
                this.currentEpisode = null;
            });
            this.player.on("loadeddata", (e) => {
                this.enterFullscreen?.();
            });
            this.player.on("pause", () => {
                if (!this.isOpen) {
                    this.isOpen = false;
                    player.stop();
                    this.currentEpisode = null;
                }
            });
            if (this.player?.fullscreen.enter) {
                this.enterFullscreen = this.player?.fullscreen.enter;
            }
        },
        playEpisode(episode: Episode): void {
            if (!this.video) {
                console.error("Video element is not set");
                return;
            }
            if (this.player) {
                this.player.stop();
            }
            this.currentEpisode = episode;
            if (episode.is_m3u8) {
                if (!this.video) {
                    console.error("Video element is not set");
                    return;
                }
                var defaultOptions = {
                    fullscreen: { iosNative: true },
                } as Plyr.Options;
                if (!HLS.isSupported()) {
                    console.log("HLS is not supported");
                    return;
                }
                var hls = new HLS();
                hls.loadSource(episode.links[0].link);
                hls.attachMedia(this.video);
                hls.on(HLS.Events.MANIFEST_PARSED, () => {
                    const availableQualities = hls.levels.map((l) => l.height);
                    availableQualities.unshift(0);
                    defaultOptions.quality = {
                        default: 0,
                        options: availableQualities,
                        forced: true,
                        onChange: (newQuality) => {
                            if (newQuality === 0) {
                                hls.currentLevel = -1;
                            } else {
                                hls.levels.forEach((level, levelIndex) => {
                                    if (level.height === newQuality) {
                                        console.log(
                                            "Found quality match with " +
                                                newQuality
                                        );
                                        hls.currentLevel = levelIndex;
                                    }
                                });
                            }
                        },
                    };
                    defaultOptions.i18n = {
                        qualityLabel: {
                            0: "Auto",
                        },
                    };

                    this.setPlayer(
                        new Plyr(this.video as HTMLVideoElement, defaultOptions)
                    );
                    hls.startLoad();
                    this.player?.play();
                });

                hls.on(HLS.Events.LEVEL_SWITCHED, function (event, data) {
                    var span = document.querySelector(
                        ".plyr__menu__container [data-plyr='quality'][value='0'] span"
                    ) as HTMLElement;
                    if (hls.autoLevelEnabled) {
                        span.innerHTML = `AUTO (${
                            hls.levels[data.level].height
                        }p)`;
                    } else {
                        span.innerHTML = `AUTO`;
                    }
                });
            } else {
                this.isOpen = true;
                this.player.source = {
                    type: "video",
                    sources: episode.links.map((link) => ({
                        src: link.link,
                        type: "video/mp4",
                        size: parseInt(link.name),
                    })),
                };
                this.player?.play();
            }
        },
    },
});
