import { defineStore } from "pinia";
import { type Episode } from "~/client";
import Plyr from "plyr";
import HLS from "hls.js";
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
            if (this.player.fullscreen.enter) {
                this.enterFullscreen = this.player.fullscreen.enter;
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
            var defaultOptions = {
                fullscreen: { iosNative: true },
                i18n,
            } as Plyr.Options;
            if (episode.is_m3u8) {
                if (!this.video) {
                    console.error("Video element is not set");
                    return;
                }

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
                        ...i18n,
                        qualityLabel: {
                            0: "Auto",
                        },
                    };

                    this.setPlayer(
                        new Plyr(this.video as HTMLVideoElement, defaultOptions)
                    );
                    hls.startLoad();
                    // @ts-ignore
                    this.player.play();
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
                if (!this.player) {
                    this.setPlayer(
                        new Plyr(this.video as HTMLVideoElement, defaultOptions)
                    );
                }
                // @ts-ignore
                this.player.source = {
                    type: "video",
                    sources: episode.links.map((link) => ({
                        src: link.link,
                        type: "video/mp4",
                        size: link.quality as number,
                    })),
                };
                // @ts-ignore
                this.player.play();
            }
        },
    },
});
