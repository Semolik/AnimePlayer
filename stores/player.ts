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
    const player: Ref<Plyr | null> = ref(null);
    const isOpen = ref(false);
    const currentEpisode: Ref<Episode | null> = ref(null);
    const updateEpisodeBus = useEventBus("update-episode");

    const setPlayer = (new_player: Plyr) => {
        if (player.value) {
            player.value.destroy();
        }
        player.value = new_player;
        player.value.on("enterfullscreen", (e) => {
            isOpen.value = true;
        });
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
        const updateProgress = async () => {
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
            currentEpisode.value.seconds = Math.floor(player.value.currentTime);
            updateEpisodeBus.emit(currentEpisode.value);
        };
        const updateProgressDebounce = useDebounceFn(updateProgress, 1000, {
            maxWait: 5000,
        });
        player.value.on("loadeddata", async (e) => {
            player.value?.fullscreen.enter();
            if (!currentEpisode.value || !player.value) return;
            if (currentEpisode.value.seconds) {
                player.value.currentTime = currentEpisode.value.seconds;
            } else {
                await updateProgress();
            }
        });
        player.value.on("timeupdate", updateProgressDebounce);
    };

    const playEpisode = (episode: Episode) => {
        const video: HTMLVideoElement = document.getElementById(
            "plyr-player"
        ) as HTMLVideoElement;
        currentEpisode.value = episode;
        var defaultOptions: Plyr.Options = {
            fullscreen: { iosNative: true },
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
                setPlayer(new Plyr(video, defaultOptions));
                hls.startLoad(episode.seconds);
                // @ts-ignore
                player.value.play();
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
            setPlayer(new_player);
            new_player.play();
        }
    };
    return { player, isOpen, currentEpisode, playEpisode };
});
