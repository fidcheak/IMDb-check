# IMDb Browser (React Native + Expo)

A clean, read-only mobile application for browsing TMDb movie and TV information. The app allows users to search titles, explore popular content, and view detailed metadata. It does **not** support video playback or streaming — it is strictly informational.

## Features

* Browse popular and trending titles
* Search movies and TV series by name
* View TMDb ratings and metadata
* Open detailed title pages
* Infinite scroll pagination
* Dark minimalist UI
* Fast navigation with Expo Router
* Clean modular architecture

## Tech Stack

* React Native with Expo
* Expo Router for navigation
* JavaScript
* Axios for API requests
* Redux for storage
* TMDb API
* Functional components with React hooks

## Installation

Clone the repository:

```
git clone https://github.com/fidcheak/IMDb-check
cd IMDb-check
```

Install dependencies:

```
npm install
```

or

```
yarn install
```

## Running the App

Start the development server:

```
npm start
```

Then run on:

* Android emulator
* iOS simulator
* Physical device via Expo Go
* Web browser (API CORS restrictions may apply)

## Architecture Notes

* API logic is isolated in the `services/api` layer
* Custom hooks manage data fetching and pagination
* UI components are reusable and modular
* Screens are separated by responsibility
* Dark theme styling is centralized

## Known Limitations

* Web builds may experience CORS restrictions depending on the API
* Pagination depends on API support
* The app is read-only by design
