import { defineStore } from "pinia";
import { type Episode, EpisodesService } from "~/client";
import Plyr from "plyr";
import HLS from "hls.js";
import { useDebounceFn } from "@vueuse/core";
import { useAuthStore } from "~/stores/auth";

const i18n = {
    restart: "Перезапуск",
    rewind: "Перемотать назад на {seektime}с",
    play: "Воспроизвести",
    pause: "Пауза",
    fastForward: "Перемотать вперед на {seektime}с",
    seek: "Поиск",
    seekLabel: "{currentTime} из {duration}",
    played: "Проиграно",
    buffered: "Буферизировано",
    currentTime: "Текущее время",
    duration: "Длительность",
    volume: "Громкость",
    mute: "Отключить звук",
    unmute: "Включить звук",
    enableCaptions: "Включить субтитры",
    disableCaptions: "Отключить субтитры",
    download: "Скачать",
    enterFullscreen: "Войти в полноэкранный режим",
    exitFullscreen: "Выйти из полноэкранного режима",
    frameTitle: "Плеер для {title}",
    captions: "Субтитры",
    settings: "Настройки",
    pip: "Картинка в картинке",
    menuBack: "Вернуться в предыдущее меню",
    speed: "Скорость",
    normal: "Обычная",
    quality: "Качество",
    loop: "Повтор",
    start: "Начать",
    end: "Конец",
    all: "Все",
    reset: "Сброс",
    disabled: "Отключено",
    enabled: "Включено",
    advertisement: "Реклама",
    qualityBadge: {
        2160: "4K",
        1440: "HD",
        1080: "HD",
        720: "HD",
        576: "SD",
        480: "SD",
    },
};
export const usePlayerStore = defineStore("player", () => {
    const authStore = useAuthStore();
    const { logined } = storeToRefs(authStore);
    const player: Ref<Plyr | null> = ref(null);
    const isOpen = ref(false);
    const currentEpisode: Ref<Episode | null> = ref(null);
    const currentEpisodes = ref<Episode[]>([]);
    watch(
        logined,
        async (value) => {
            if (value) {
                currentEpisodes.value =
                    await EpisodesService.getEpisodesApiV1EpisodesGet();
            }
        },
        { immediate: true }
    );
    const removeEpisode = async (episode: Episode) => {
        currentEpisodes.value = currentEpisodes.value.filter(
            (e) => e.id !== episode.id
        );
        await EpisodesService.unsetEpisodeProgressApiV1EpisodesEpisodeIdProgressDelete(
            episode.id
        );
    };
    const playNextEpisode = async () => {
        if (!currentEpisode.value) return;
        const nextEpisode =
            await EpisodesService.getNextEpisodeApiV1EpisodesEpisodeIdNextGet(
                currentEpisode.value.id
            );
        if (nextEpisode) {
            currentEpisodes.value = currentEpisodes.value.map((e) => {
                // @ts-ignore
                if (e.id === currentEpisode.value.id) {
                    return nextEpisode;
                }
                return e;
            });
            playEpisode(nextEpisode, true);
        } else {
            currentEpisodes.value = currentEpisodes.value.filter(
                // @ts-ignore
                (e) => e.id !== currentEpisode.value.id
            );
        }
    };
    const setPlayer = (new_player: Plyr, playOnLoad = false) => {
        if (player.value) {
            player.value.destroy();
        }
        player.value = new_player;
        player.value.on("ended", playNextEpisode);
        const stop = () => {
            isOpen.value = false;
            currentEpisode.value = null;
            new_player.destroy();
            player.value = null;
        };
        player.value.on("exitfullscreen", (e) => {
            stop();
        });

        player.value.on("pause", () => {
            if (!isOpen.value) stop();
        });
        const nextButtonCreated = ref(false);
        const createNextEpisodeButton = async () => {
            if (nextButtonCreated.value) return;
            if (!currentEpisode.value || !authStore.logined || !player.value)
                return;
            const nextEpisode =
                await EpisodesService.getNextEpisodeApiV1EpisodesEpisodeIdNextGet(
                    currentEpisode.value.id
                );
            if (!nextEpisode) return;
            const nextEpisodeButton = document.createElement("button");
            nextEpisodeButton.innerHTML = `Следующая серия`;
            nextEpisodeButton.className =
                "fixed right-4 px-2.5 py-1.5 bg-white/10 rounded-md text-gray-500 hover:bg-white/20 hover:text-gray-600 z-50";
            nextEpisodeButton.style.bottom = "50px";
            nextEpisodeButton.addEventListener("click", async () => {
                currentEpisodes.value = currentEpisodes.value.map((e) => {
                    // @ts-ignore
                    if (e.id === currentEpisode.value.id) {
                        return nextEpisode;
                    }
                    return e;
                });
                playEpisode(nextEpisode, true);
            });
            player.value.elements.wrapper?.appendChild(nextEpisodeButton);
            nextButtonCreated.value = true;
        };
        const updateProgress = async () => {
            console.log(player.value);
            if (!player.value || !currentEpisode.value || !authStore.logined) {
                return;
            }
            var progress = Math.floor(
                (player.value.currentTime / player.value.duration) * 100
            );
            if (isNaN(progress)) progress = 0;
            progress = progress || 1;
            await EpisodesService.setEpisodeProgressApiV1EpisodesEpisodeIdProgressPost(
                currentEpisode.value.id,
                progress,
                Math.floor(player.value.currentTime)
            );
            currentEpisode.value.progress = progress;
            if (progress >= 97) {
                createNextEpisodeButton();
            }
            currentEpisode.value.seconds = Math.floor(player.value.currentTime);
            // @ts-ignore
            currentEpisodes.value = currentEpisodes.value.map((e) => {
                // @ts-ignore
                if (e.id === currentEpisode.value.id) {
                    return currentEpisode.value;
                }
                return e;
            });
        };
        const updateProgressDebounce = useDebounceFn(updateProgress, 1000, {
            maxWait: 5000,
        });

        player.value.on("seeked", async () => {
            if (!currentEpisode.value || !player.value) return;
            if (
                currentEpisode.value.seconds ===
                Math.floor(player.value.currentTime)
            )
                return;
            await updateProgress();
        });
        if (playOnLoad) {
            player.value.on("canplay", async () => {
                isOpen.value = true;
                if (!currentEpisode.value || !player.value) return;
                player.value.play();
                player.value.fullscreen.enter();
                if (currentEpisode.value.seconds) {
                    player.value.currentTime = currentEpisode.value.seconds;
                } else {
                    await updateProgress();
                }
                player.value.on("timeupdate", updateProgressDebounce);
            });
        }
    };

    const playEpisode = (episode: Episode, update_source = false) => {
        const video: HTMLVideoElement = document.getElementById(
            "plyr-player"
        ) as HTMLVideoElement;

        currentEpisode.value = episode;
        if (!episode.links) return;
        if (update_source && player.value) {
            if (episode.is_m3u8) {
                if (!HLS.isSupported()) {
                    console.log("HLS is not supported");
                    return;
                }

                var hls = new HLS();
                hls.loadSource(episode.links[0].link);
                hls.attachMedia(video);
                hls.on(HLS.Events.MANIFEST_PARSED, () => {
                    hls.startLoad(episode.seconds);
                    player.value?.play();
                });

                hls.on(HLS.Events.LEVEL_SWITCHED, function (event, data) {
                    var span = document.querySelector(
                        ".plyr__menu__container [data-plyr='quality'][value='0'] span"
                    ) as HTMLElement;
                    if (hls.autoLevelEnabled) {
                        span.innerHTML = `Авто (${
                            hls.levels[data.level].height
                        }p)`;
                    } else {
                        span.innerHTML = `Авто`;
                    }
                });
            } else {
                player.value.source = {
                    type: "video",
                    sources: episode.links.map((link) => ({
                        src: link.link,
                        type: "video/mp4",
                        size: link.quality as number,
                    })),
                };
                player.value.currentTime = currentEpisode.value.seconds || 0;
                player.value.play();
            }
            return;
        }

        var defaultOptions: Plyr.Options = {
            fullscreen: { iosNative: true, fallback: true },
            i18n,
        };

        if (episode.is_m3u8) {
            if (!HLS.isSupported()) {
                console.log("HLS is not supported");
                return;
            }

            var hls = new HLS();
            hls.loadSource(episode.links[0].link);
            hls.attachMedia(video);
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
                                        "Found quality match with " + newQuality
                                    );
                                    hls.currentLevel = levelIndex;
                                }
                            });
                        }
                    },
                };

                defaultOptions.i18n = {
                    ...i18n,
                    qualityLabel: {
                        0: "Auto",
                    },
                };
                hls.startLoad(episode.seconds);
                setPlayer(new Plyr(video, defaultOptions), true);
            });

            hls.on(HLS.Events.LEVEL_SWITCHED, function (event, data) {
                var span = document.querySelector(
                    ".plyr__menu__container [data-plyr='quality'][value='0'] span"
                ) as HTMLElement;
                if (hls.autoLevelEnabled) {
                    span.innerHTML = `Авто (${hls.levels[data.level].height}p)`;
                } else {
                    span.innerHTML = `Авто`;
                }
            });
        } else {
            let new_player: Plyr = new Plyr(video, defaultOptions);
            new_player.source = {
                type: "video",
                sources: episode.links.map((link) => ({
                    src: link.link,
                    type: "video/mp4",
                    size: link.quality as number,
                })),
            };
            new_player.currentTime = currentEpisode.value.seconds || 0;
            setPlayer(new_player, true);
        }
    };

    return {
        player,
        isOpen,
        currentEpisode,
        playEpisode,
        removeEpisode,
        currentEpisodes,
    };
});
