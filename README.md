![Anahita social networking platform and framework](https://s3.ca-central-1.amazonaws.com/production.anahita.io/media/logos/homepage_logo.png)

### Women Life Freedom

We stand in solidarity with Iranian women!

#MahsaAmini #WomenLifeFreedom #IranRevolution

# Anahita React

The web app for [Anahita](https://www.anahita.io), built with React 18 and
Material-UI 4. It is a client of **anahita-services**, the Go microservices
back end, and talks to it only through its HTTP API.

This repository is under active development. More comprehensive documentation
is on its way; this page covers getting it running.

## How it fits together

- **The API** is served by anahita-services behind nginx, at
  `http://localhost` in development.
- **Signing in happens on the server, not in this app.** The app sends people
  to auth-service's sign-in page using OAuth 2.0 with PKCE, as the first-party
  client `anahita-web`, and comes back to `/oauth/callback`. Tokens are kept
  server-side behind a session cookie; the app never sees a password.
- **So does signing up.** Creating an account, accepting an invitation and
  confirming an email address are all server-rendered pages on auth-service.
  Whether the "Create account" button appears is read from the server's
  NodeInfo (`/.well-known/nodeinfo`), which reflects its `REGISTRATION_MODE`.
- **Support details** — email, phone and website — are read from NodeInfo too,
  and configured on the back end with `SUPPORT_EMAIL`, `SUPPORT_PHONE` and
  `SUPPORT_WEBSITE`.

## Requirements

- [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/)
- anahita-services running locally — see its README. Its nginx allows
  `http://localhost:3000` for CORS, which is where this app runs.

## Installation

```sh
yarn install
cp .env.sample .env
```

Edit `.env`:

| Variable | Value |
| --- | --- |
| `PUBLIC_URL` | Where the app runs, usually `http://localhost:3000` |
| `REACT_APP_NAME` | The name of your installation, for example `Anahita` |
| `REACT_APP_DESCRIPTION` | A one-line description, for example `Social Networking Platform & Framework` |
| `REACT_APP_API_BASE_URL` | The anahita-services API, `http://localhost` in development |
| `REACT_APP_NOTIFICATIONS_CHECK_INTERVAL` | How often to check for new notifications, in milliseconds. Defaults to `15000` |
| `REACT_APP_ASSETS` | Optional. The name of a custom assets directory under `src/assets/`. Empty uses `src/assets/default` |
| `REACT_APP_GOOGLE_ANALYTICS` | Optional. A Google Analytics ID for a live installation |
| `REACT_APP_LOCATION_FIXED_COUNTRY` | Optional. Pins new locations to one country and hides the field |
| `REACT_APP_LOCATION_FIXED_STATE_PROVINCE` | Optional. Pins new locations to one state or province |
| `REACT_APP_LOCATION_FIXED_CITY` | Optional. Pins new locations to one city and hides the field |
| `DISABLE_ESLINT_PLUGIN` | `true` on staging and production builds, `false` in development |

`REACT_APP_*` values are compiled into the bundle at build time. Changing one
means rebuilding, and none of them may hold a secret.

`REACT_APP_SIGNUP_CLOSED` and `REACT_APP_GOOGLE_MAPS_API_KEY` are no longer
used. Registration is controlled on the server, and maps use Leaflet.

Then start the app:

```sh
yarn start
```

It opens at `http://localhost:3000`.

## Scripts

| Command | What it does |
| --- | --- |
| `yarn start` | Development server with hot reload |
| `yarn test` | Tests, in watch mode |
| `yarn build` | Production build into `build/` |

## Terms of Service and Privacy Policy

The documents live in `src/statics/legal/` as `tos.md` and `privacy.md`, and
are shown at `/legal/tos` and `/legal/privacy`. **The ones in this repository
are boilerplate — replace them with your own before going live.**

Each document has a version number in `src/statics/legal/index.js`. When you
change a document, raise its version: every signed-in person whose accepted
version is older is taken to `/agreements` and asked to accept it before they
can use the app again. This applies to existing members and new ones alike.

## Customising

- **Assets** — copy `src/assets/default` to a directory of your own, and set
  `REACT_APP_ASSETS` to its name.
- **Languages** — translations are in `src/languages/`, currently `en-GB` and
  `fr-FR`.

## Deploying on AWS Amplify

Connect Amplify to your repository and it builds on every push using
`amplify.yml`. Set the variables above as Amplify environment variables rather
than using a `.env` file, and point `REACT_APP_API_BASE_URL` at your public API
domain, for example `https://api.yourdomain.com`. The app's own origin must be
allowed for CORS by nginx in anahita-services, and its `/oauth/callback` must be
registered as a redirect URI on the `anahita-web` OAuth client.

## Credits

Anahita is developed and maintained by [rmdStudio Inc.](http://www.rmdstudio.com),
a software development company in Vancouver, Canada.

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).
