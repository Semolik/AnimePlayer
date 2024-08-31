# AnimePlayer

[Английская версия](README.md)

AnimePlayer — это современная веб-платформа для стриминга аниме, созданная на основе Nuxt 3. Проект требует наличия [AnimePlayerApi](https://github.com/Semolik/AnimePlayerApi) для работы.

## Функциональность

-   **Каталог аниме**: Просмотр коллекции аниме с парсеров AnimeVost и Anidub.
-   **Интеграция c Shikimori**: Просмотр информации дополнительной информации, отображение связанных аниме.
-   **Поиск**: Быстрый поиск любимых аниме.
-   **Аутентификация пользователей**: Регистрация, вход, управление профилем, восстановление пароля, вход через сервисы Google, GitHub и Discord.
-   **Детальная информация**: Просмотр эпизодов, рейтингов и описаний.
-   **Стриминг**: Просмотр аниме непосредственно на платформе.
-   **Недавно просмотренные**: Отслеживание прогресса просмотра.
-   **Адаптивный дизайн**: Оптимизирован для десктопов и мобильных устройств.
-   **Избранное**: Добавление аниме в список ожидаемого просмотра.

## Главная страница

![Main page](https://github.com/user-attachments/assets/025aac00-1fe2-498d-b262-310b9a4add14)


<details><summary>Еще скриншоты</summary>
    
## Поиск

![Search](https://github.com/user-attachments/assets/ace033fe-60c6-40a9-8d05-9be77637a2cd)

## Жанры

![Genres](https://github.com/user-attachments/assets/6801b331-c886-4cb7-b42e-67b602b7e6fa)

## Страница тайтла

![Title page](https://github.com/user-attachments/assets/6c206112-d736-4b3f-9e42-9d01f3e8a032)

## Профиль

![Profile](https://github.com/user-attachments/assets/bec6bfc2-e319-4919-9558-772edc78a878)


</details>




## Требования

-   Убедитесь, что [AnimePlayerApi](https://github.com/Semolik/AnimePlayerApi) установлен и запущен.

## Установка

1. Клонируйте репозиторий:

    ```bash
    git clone https://github.com/Semolik/AnimePlayer.git
    cd AnimePlayer
    ```

2. Установите зависимости:

    ```bash
    npm install
    ```

3. Настройте переменные окружения для подключения к API.
   переименуйте файл `.env.example` в `.env` и укажите локальный и публичный адреса API:

    ```bash
    NUXT_API_LOCAL_URL=http://localhost:8001
    NUXT_PUBLIC_API_URL=http://example.com:8001
    ```

## Разработка

Для запуска сервера разработки:

```bash
npm run dev
```

Для генерации клиента API используйте команду (API должен быть запущен):

```bash
npm run generate-client
```

## Сборка

Для сборки проекта:

```bash
npm run build
```

Для запуска собранного проекта рекомендуется использовать [PM2](https://pm2.keymetrics.io/):

```bash
pm2 start ecosystem.config.cjs
```

## Лицензия

AnimePlayer распространяется под лицензией MIT.
