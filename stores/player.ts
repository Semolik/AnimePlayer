import { defineStore } from "pinia";
import { type Episode } from "~/client";
import Plyr from "plyr";
import HLS from "hls.js";
import { useDebounceFn } from "@vueuse/core";
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
export const usePlayerStore = defineStore({
    id: "player",
    state: () => ({
        player: null as Plyr | null,
        isOpen: false,
        currentEpisode: null as Episode | null,
    }),

    actions: {
        setPlayer(player: Plyr): void {
            if (this.player) {
                this.player.destroy();
            }
            this.player = player;
            this.player.on("enterfullscreen", (e) => {
                this.isOpen = true;
            });
            const stop = () => {
                this.isOpen = false;
                this.currentEpisode = null;
                player.destroy();
                this.player = null;
            };
            this.player.on("exitfullscreen", (e) => {
                stop();
            });
            this.player.on("loadeddata", (e) => {
                this.player?.fullscreen.enter();
            });
            this.player.on("pause", () => {
                if (!this.isOpen) stop();
            });
            var oldProgress = 0;
            const updateProgress = useDebounceFn(
                () => {
                    if (!this.player) return;
                    var progress = Math.floor(
                        (this.player.currentTime / this.player.duration) * 100
                    );
                    if (isNaN(progress)) progress = 0;
                    if (progress !== oldProgress) {
                        oldProgress = progress;
                        console.log("Progress", progress);
                    }
                },
                1000,
                { maxWait: 5000 }
            );
            this.player.on("timeupdate", updateProgress);
        },
        playEpisode(episode: Episode): void {
            const video = document.getElementById(
                "plyr-player"
            ) as HTMLVideoElement;
            this.currentEpisode = episode;
            var defaultOptions = {
                fullscreen: { iosNative: true },
                i18n,
            } as Plyr.Options;
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
                        ...i18n,
                        qualityLabel: {
                            0: "Auto",
                        },
                    };

                    this.setPlayer(new Plyr(video, defaultOptions));
                    hls.startLoad();
                    // @ts-ignore
                    this.player.play();
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
                var player = new Plyr(video, defaultOptions);
                player.source = {
                    type: "video",
                    sources: episode.links.map((link) => ({
                        src: link.link,
                        type: "video/mp4",
                        size: link.quality as number,
                    })),
                };
                this.setPlayer(player);
                // @ts-ignore
                this.player.play();
            }
        },
    },
});
