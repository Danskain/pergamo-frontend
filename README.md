# Pergamo

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.13.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4300/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Deployment Variables

For Docker and Railway deployments, the application reads runtime variables from `env.js`.

Environment files available:

- `src/environments/environment.ts`: local defaults
- `src/environments/environment.qa.ts`: QA defaults
- `src/environments/environment.production.ts`: production defaults

Required variables:

```bash
API_BASE_URL=https://your-api.example.com/api/v1
LEGACY_APP_ORIGIN=https://your-legacy-app.example.com/auth
LEGACY_LOGOUT_URL=https://your-legacy-app.example.com/auth
```

QA example:

```bash
LEGACY_APP_ORIGIN=https://capacitacion.hlips.com.co/auth
LEGACY_LOGOUT_URL=https://capacitacion.hlips.com.co/auth
```

Production example:

```bash
LEGACY_APP_ORIGIN=https://pergamo.hlips.com.co/auth
LEGACY_LOGOUT_URL=https://pergamo.hlips.com.co/auth
```

Notes:

- `LEGACY_APP_ORIGIN` is normalized internally to the origin required by `postMessage`.
- `LEGACY_LOGOUT_URL` is used directly to redirect the user back to the legacy Pergamo login/logout page.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
