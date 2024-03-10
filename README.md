# Shongo Frontend

Angular frontend application for reservation system Shongo. Created by Michal Drobňák.

## Dependencies

- Node 14
- npm

## Installation

1. Clone the repository.
2. Run `npm install`, npm will take care of the rest.

## Running the app

- Never use `ng serve` or `npm start` for production. Instead build the app with `npm run build-prod` and deploy it on a server. Production build creates both czech and english versions of the app in the `dist` folder.
- You can run the app in watch mode with `npm start` or in production mode with `npm run start-prod`.

## Configuration

You can configure app's environment in `src/environments`. Modify **environment.ts** for development build or **environment.prod.ts** for production build. Here you can set REST api's host and port, or specify whether HTTPS should be used.

### Configuring a resource

**Resources need to be configured before they can be used on the frontend.** They won't be accesible without proper configuration.

#### Virtual resource

1. Add the new technology to Technology enumerable in `src/app/shared/models/enums/technology.enum.ts`. Use the same value as will be returned from REST api.
2. Add a human readable name to **technologyNameMap** in virtual room configuration file. Optionally tag the name with `$localize` to support i18n, it will be available for translation after generating translation file. Make sure to use back ticks on a string when using `$localize` otherwise it won't work.

#### Physical resource

1. Add a human readable name to **tagNameMap** also in physical resource configuration file. You can use `$localize` as described in virtual resource configuration.

## Development

Use `npm start` to run development server, app will refresh automatically on file updates.

### Pre-commit hooks

App uses Husky and Lint-staged to run tests and eslint before every commit.

### Mocking backend services

Application needs an Oauth2 authentication server and backend implementation to function properly. Here we describe technologies we use for development, you can however substitute them with other technologies of your choice.

#### Mockoon - [link](https://mockoon.com/)

We use Mockoon to mock backend's REST API, feel free to use our [Mockoon environment](https://github.com/MichalDrobnak/shongo-mockoon) (check readme for usage).

#### mock-oauth2-server - [link](https://github.com/navikt/mock-oauth2-server)

We use mock-oauth2-server for mocking Oauth2 authentication server. It can be easily installed with docker (tutorial in link). When running the image make sure to set host to `localhost` and port mapping like this `docker run -p 8080:8080 -h localhost $IMAGE_NAME`.

## Testing

App uses Jasmine and Karma to run unit tests. You can run tests with `npm run test`.

## Internationalization

App is configured to support czech translation. You can create a translation like this:

1. Use `npm run extract-i18n` to generate translation file. Generated file can be found in `src/locales` folder under the name `messages.xlf`.
2. Copy the `messages.xlf` file inside the `locales` folder and name it `messages.cs.xlf`.
3. Create translations, tutorial [here](https://angular.io/guide/i18n-common-translation-files).
4. You can now build czech version of the app with `ng run shongo-frontend:build:cs` and english version with `ng run shongo-frontend:build:en` (you need Angular CLI to use ng). 
