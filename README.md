# AnimePlayer

[Russian readme](README-ru.md)

AnimePlayer is a modern web platform for streaming anime, built on Nuxt 3. The project requires [AnimePlayerApi](https://github.com/Semolik/AnimePlayerApi) to function.

## Functionality

-   **Anime catalog**: Browse a collection of anime from AnimeVost and Anidub parsers.
-   **Shikimori integration**: View additional information, display related anime.
-   **Search**: Quickly search for your favorite anime.
-   **User authentication**: Registration, login, profile management, password recovery, login via Google, GitHub, and Discord services.
-   **Detailed information**: View episodes, ratings, and descriptions.
-   **Streaming**: Watch anime directly on the platform.
-   **Recently viewed**: Track viewing progress.
-   **Responsive design**: Optimized for desktop and mobile devices.
-   **Favorites**: Add anime to your watchlist.

## Requirements

-   Make sure [AnimePlayerApi](https://github.com/Semolik/AnimePlayerApi) is installed and running.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Semolik/AnimePlayer.git
    cd AnimePlayer
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables for connecting to the API. Rename the `.env.example` file to `.env` and specify the local and public API addresses:

    ```bash
    NUXT_API_LOCAL_URL=http://localhost:8001
    NUXT_PUBLIC_API_URL=http://example.com:8001
    ```

## Development

To start the development server:

```bash
npm run dev
```

To generate the API client, use the following command (the API must be running):

```bash
npm run generate-client
```

## Build

To build the project:

```bash
npm run build
```

For running the built project, it is recommended to use [PM2](https://pm2.keymetrics.io/):

```bash
pm2 start ecosystem.config.cjs
```

## License

AnimePlayer is distributed under the MIT License.
