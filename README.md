# React Best Practices

A lot of effort went into writing this README file. You will save yourself a lot of time and headaches
if you take the time to read it from start to finish before jumping in. Seriously, read it.

## What are the goals of this project?

React isn't opinionated about how it should be implemented on projects. This is liberating, but also challenging because
there are so many different ways to do things. This project establishes norms that we, as an organization, follow on our
React projects to bring consistency to the way we approach solutions.

## How should I use it?

- Project Template
  - Fork it for your next project
  - The project is pre-configured for immediate productivity
  - Remove any code that isn’t valuable to your project
- Idea Incubator
  - Submit tickets for things that you’d like to try out, but don’t have time for
  - Try out a new charting library, or a new testing library, or new storybook plugin
- Bench Filler
  - Pick up a ticket the next time you are on the bench
  - Incorporate good stuff from your last project into the repo, so that others can benefit
- Establish Standards
  - Participate in the PR review process to debate best practices and establish standards

## Overview of our Best Practices

- Watch this recent [roundtable discussion about this repo](https://rpo365-my.sharepoint.com/:v:/g/personal/jrupp_rightpoint_com/Ecng-JgiIu9JsYOyKxlLm1YB7cJqIFuP48sQ1IEV6lHmIw).
- Take a look at this [slide deck that was used to give an overview of the best practices repo and accompanying code](https://docs.google.com/presentation/d/1-Sut2iazimtrCtfAuTcMOzDIMXp60zTRQpJmUF-QMwM/edit?usp=sharing).

## What's in the box?

- Node Version Enforcement
  - Verifies that the developer is using the correct node version
- Linting
  - TypeScript Linting
  - React Linting
  - Accessibility Linting
  - CSS Linting
  - Folder structure linting
- Code formatting
  - prettier
- Accessibility Auditors
  - react-axe: Shows accessibility errors in dev mode at runtime (in console)
  - pA11y linting: Non-accessible code throws errors in your IDE and at compile-time
- CI/CD Builds
  - CircleCI: Validates pull requests, runs audits, and deploys
  - Github Actions
- Test Coverage
  - 70% lines covered required
- Git Hooks
  - post-merge (warn when you need to reinstall packages)
  - pre-commit (auto linting)
  - pre-push (auto testing)
- Production Optimization
  - Bundle Analyzer pre-configured and ready to run
  - Lighthouse pre-configured and ready to run
- Patterns for API Contracting
  - Ability to run application offline
- VS Code
  - Preferred configuration for VS code including support for debugging in IDE

## Starting a New React Project

If you are starting a new React project, you should be starting it from here. There is so much in here though, that it
can be overwhelming, so here are some steps to follow to get started.

1. Fork the repo
   - Or copy all the config from the repo into your project
2. Study `src/index.tsx`
   - Study what is going on, but probably don’t mess with unless you need to.
   - There is a specific way that the application bootstraps itself so that the API Mocking is initialized
     only for development such that the API Mocking layer doesn't get executed or loaded for production builds.
3. Create your template -> `src/App.tsx`
   - There is some stuff in here that you probably won't want to keep such as `StatusToggle`.
   - Rip out all the default markup that you don't need and replace it with your stuff.
4. Create a new page-level component -> `src/pages/*`
   - Feel free to remove the other page level components, but probably keep them initially as a reference for how to write your own tests.
5. Add a route -> `src/pages/PageRoutes.tsx`
   - Replace the routes with new routes to your new page components
6. Create shared components -> `src/components/*`
   - Create shared components for any components that you want to reuse on multiple pages
7. Create API contracts -> `src/mockApi/contracts/*`
   - Each new contract should implement `src/lib/api-mocking/interfaces/ApiContract`
   - Put each contract in a file that matches the path where `/` is replaced with `-` like this `src/mockApi/contracts/api-myservice-post.ts`
   - Import your contract in `src/mockApi/contracts/index.ts` and add it to the contracts array.
   - Now your contract will be used to serve requests in development and tests.
8. Read the JS Docs
   - A lot of effort went into documenting the code in RTL Utils, so drill into it functions like `renderForTestSuite`
     and `renderComponent`, and interfaces like `TestConfig` and `RtlUtilsConfig` and you will useful JS Docs to
     guide you.

---

## Environment Variables

There are some custom environment variables in the project that drive specific behaviors in the best practices project.
For information about how CRA environment variable work see the CRA docs for [Adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables).
The custom environment variables used by the project are documented below:

####`VITE_USE_MOCK_BACKEND`

- If this is true then the api contracts configured in `mockApi/contracts` will be active in the environment. This is
  useful for configuring your local dev environment to run without backend, but configure your QA and PROD environments
  to require a working backend.

####`VITE_API_ROOT`

- Use this to set the base of your API path services path. This is useful when you use one set of endponts for dev
  and a different set for QA and Prod.

---

## VSCode Configuration for Prettier

You'll probably want to configure VSCode to run prettier automatically when a file is saved. Here is how:

- Install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension for VSCode
- Open your project-specific settings via `Ctrl-Shift-P` and picking "Preferences: Open Workspace Settings"
  - Search for "default format" and set the default formatter to `esbenp.prettier-vscode`.
  - Search for "format save" and check "Format on Save"

You can also enable those settings by creating a `.vscode/settings.json` file with these contents:

```
{
    "editor.formatOnSave": true,
    "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}
```

## Debugging Tests in VSCode

Did you know that you can render your component in a test in debug mode and set breakpoints to debug issues that you've
reproduced in your tests? This is already setup in the project with the provided launch.json. If you want to try it out,
put a breakpoint in one of your tested components and then run the test suite in debug mode by pressing `F5` or from the
VSCode menu, choose `Run -> Start debugging`.

---

## NPM Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode with built-in coverage reporting.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run analyze`

Launches packet and module analyzer against production build, launches in browser (requires build).

#### `npm run test:cov`

Generate test coverage report.

#### `npm run lint`

Auto-fix linting errors.

#### `npm run prettier`

Auto-fix formatting.

#### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run lighthouse`

Run Google Lighthouse and saves an audit report in the `./lighthouse` directory.

---

## Initialize RTL Utils for use in tests

In order to use RTL Utils in your tests, you need to initialize it. A typical setup found in `src/setupTests.tsx` would look like the following if you are using redux:

```typescript jsx
import { initRtlUtils } from 'lib/rtl-utils/newComponentTest'
import { apiContracts } from 'mockApi/contracts'
import { createStore } from 'redux/createStore'
import { defaultReduxState } from 'redux/defaultReduxTestState'

const rtlUtilsConfig: RtlUtilsConfig<Store<RootState>> = {
  apiContracts,
  defaultApplicationState: defaultReduxState,
  createAppStateStore: initialState => {
    return createStore(initialState)
  },
  wrapComponentTest: (TestWrapper, testConfig, appStateStore) => {
    return function TestWrapperWithLocaleAndReduxProviders(injectedProps): React.ReactElement {
      return (
        <Provider store={appStateStore as Store<RootState>}>
          <LocaleWrapper>
            <TestWrapper {...injectedProps} />
          </LocaleWrapper>
        </Provider>
      )
    }
  },
}
initRtlUtils(rtlUtilsConfig)
```

---

## Learn More about RTL Utils

We have developed test utils that make tests far quicker to develop. The best practices repo provides examples and
thorough JS Docs to help developers understand what the utils do. In order to become proficient with the utils, developers
will need to study the example tests and the JS Docs on the supporting test utilities. The best place to start
reading the JS Docs is `src/lib/rtl-utils/index.ts` and `src/lib/rtl-utils/ComponentTest.ts`.

---

## How to Develop without a Backend

It is really helpful to be able to develop and run your code in the browser without a backend, and equally useful to
write top-level integration tests that trigger calls to your API that are configured with know mocked responses.
Everything you need in order to develop and test without a backend is included in the project. By following the
instructions below to add an API contract in the proper location, that contract will automatically be served up by the
browser in development and your tests, but that behavior is configurable by you in the contract. The contract is just a
TypeScript interface that you implement, and then add to an array of other API contracts.

### Add a Mock API Contract

1. Enable mock backend with the `VITE_USE_MOCK_BACKEND=true` in `.env.development`. It can be enabled in other environments as well if desired.
2. Read the JS Docs for `src/lib/api-mocking/interfaces/ApiContract`
   - Note that the `scope` attribute in the contract determines where the contract will be loaded.
   - The `runtime` attribute must be set to `true` in order for the contract will be loaded in development. If loaded for
     runtime, your contract handler will be used to serve any API calls that match the url pattern in any environments with `VITE_USE_MOCK_BACKEND=true`.
3. Go to `src/mockApi/contracts`
4. Add a new ts file that implements ApiContract (`src/lib/api-mocking/interfaces/ApiContract`)
5. Implement the ApiContract. Example Below:

```typescript
const contract: ApiContract<void, ProjectJson, Error> = {
  url: '/api/myService',
  method: 'GET',
  success: (url, pathParams, jsonBody, opts): Response<ProjectJson> => ({
    status: 200,
    body: [
      { id: 1, title: 'test title 1', division: 'test division 1' },
      { id: 2, title: 'test title 2', division: 'test division 2' },
    ],
  }),
  error: (url, pathParams, jsonBody, opts): Response<Error> => ({
    status: 500,
    body: defaultErrorResponse,
  }),
  // The scope determines where the contract will be loaded
  scope: {
    test: true, // if this is true then this contract will be loaded for tests
    runtime: true, // if this is true then this contract
  },
}
```

5. Import your contract in `src/mockApi/contracts/index.ts`. All your contracts need to be imported and added to the `apiContracts` array.

```typescript
import myApiContract from 'mockApi/contracts/api-myService'
export const apiContracts = [myApiContract]
```

### How to Create a Mock Backend Service

You can implement an API Contract with faked data that you generate when the app launches, but your API will not be able
save your changes. A more sophisticated approach is to create a simple backend service using Faker that you use to implement your
API contract. Here are the steps to create one.

- Add a new ts file to `src/api/mockApi/services` that will contain your service. For example `src/mockApi/services/MyService.ts`
- The easiest way to implement a service is by extending `CrudService` (`src/mockApi/services/CrudService.ts`)
  See `src/mockApi/services/ProjectService.ts` for an example.

Note:
You can implement a fake backend service however you want. You do not have to extend `CrudService`,
but it is a convenient option because it already has CRUD operations implemented.
You can keep it as simple as you want or get as fancy as you want.

### How To Implement an API Contract Using Your Mock Backend Service

Now that you have your backend service. Implement your API contract using the service. Here are some examples contracts.

GET (get all)

```typescript
const contract: ApiContract<void, ProjectJson, Error> = {
  url: '/api/user',
  method: 'GET',
  success: (): Response<ProjectJson[]> => ({
    status: 200,
    body: userService.listAll(),
  }),
  error: (): Response<Error> => ({
    status: 500,
    body: defaultErrorResponse,
  }),
  scope: {
    test: true,
    runtime: true,
  },
}
```

GET (get one)

```typescript
const contract: ApiContract<void, ProjectJson, Error> = {
  url: '/api/user/:usedId',
  method: 'GET',
  success: (url, pathParams): Response<ProjectJson[]> => ({
    status: 200,
    body: userService.findById(pathParams.usedId),
  }),
  error: (): Response<Error> => ({
    status: 500,
    body: defaultErrorResponse,
  }),
  scope: {
    test: true,
    runtime: true,
  },
}
```

PATCH

```typescript
const contract: ApiContract<ProjectJson, ProjectJson, Error> = {
  url: '/api/user',
  method: 'PATCH',
  success: (url, pathParams, jsonBody): Response<ProjectJson> => ({
    status: 200,
    body: userService.update(jsonBody),
  }),
  ...
}
```

POST

```typescript
const contract: ApiContract<ProjectJson, ProjectJson, Error> = {
  url: '/api/user',
  method: 'POST',
  success: (url, pathParams, jsonBody): Response<ProjectJson> => ({
    status: 200,
    body: userService.insert(jsonBody),
  }),
  ...
}
```

---

## Adding SVGs

### As a Static Asset

With webpack, using static assets like SVG's works similarly to CSS.

You can **`import` an SVG file right in a JavaScript module**. This tells webpack to include that file in the bundle. Unlike CSS imports, importing an SVG gives you a string value. This value is the final path you can reference in your code, e.g. as the `src` attribute of an image.

Here is an example:

```js
import React from 'react'
import logo from './logo.svg' // Tell webpack this JS file uses this image

console.log(logo) // /logo.84287d09.svg

function Header() {
  // Import result is the URL of your image
  return <img src={logo} alt="Logo" />
}

export default Header
```

This ensures that when the project is built, webpack will correctly move the images into the build folder, and provide us with correct paths.

This works in CSS too:

```css
.Logo {
  background-image: url(./logo.svg);
}
```

webpack finds all relative module references in CSS (they start with `./`) and replaces them with the final paths from the compiled bundle. If you make a typo or accidentally delete an important file, you will see a compilation error, like when you import a non-existent JavaScript module. The final filenames in the compiled bundle are generated by webpack from content hashes. If the file content changes in the future, webpack will give it a different name in production so you don’t need to worry about long-term caching of assets.

### As a React Component

You can import SVGs directly as React components. You can use either of the two approaches. In your code it would look like this:

```js
import { ReactComponent as Logo } from './logo.svg'

function App() {
  return (
    <div>
      {/* Logo is an actual React component */}
      <Logo />
    </div>
  )
}
```

This is handy if you don't want to load SVG as a separate file. Don't forget the curly braces in the import! The `ReactComponent` import name is significant and tells Create React App that you want a React component that renders an SVG, rather than its filename.

> **Tip:** The imported SVG React Component accepts a `title` prop along with other props that a `svg` element accepts. Use this prop to add an accessible title to your svg component.

> **:rotating_light: PERFORMANCE WARNING :rotating_light::** Inlining SVG's into the DOM as React components _can_ cause performance issues because the SVG markup is included in the JS bundle. [More information here](https://twitter.com/_developit/status/1382838799420514317?lang=en).

---

## CI/CD

CI/CD configuration is very specific to application, environments, infrastructure, and organizational development practices. While this repo's CI/CD config can't be taken and used directly, it can act as a blueprint that can be applied to your project's context.

- [CI/CD introduction](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/introduction-to-ci.md) - This is a good background if you aren't familiar with the concept of CI or CD.
- [YAML](https://learnxinyminutes.com/docs/yaml/) - Many CI/CD services use YAML to define configurations.

This repo is using [GitHub Actions](https://docs.github.com/en/actions) actions for it's CI/CD. There are three workflows defined:

- `.github/workflows/ci.yml` - `rp-react-best-practices CI` : The main workflow that executes all builds and tests on push.
- `.github/workflows/deploy-to-S3.yml` - `rp-react-best-practices deploy` : The workflow that that deploys the `master` branch to AWS.
- `.github/workflows/nightly-lighthouse.yml` - `nightly lighthouse` : The workflow that generates the nightly lighthouse reports

Since each "workflow" (other services might call these "pipelines") is specific to the application and environment you'll need to evaluate your needs and customize them further. Ultimately, the primary purpose of CI/CD is to gain confidence that code that passes the build will not cause any regressions. If we examine the `.github/workflows/ci.yml` workflow you can see that each step will `run` some terminal command. While not required, it is a good idea for these to be plainly obvious and follow some pattern or documentation. Where possible/feasible, it is encouraged to reference `package.json` defined npm scripts so that the commands can be well scoped.

As for as any convention to organize your npm script, it is a somewhat arbitrary choice but in this repo it is as follows. Group scripts by a scope and delimit with a `:` if more fidelity is required. For example, `build`, `build:storybook`, `lhci`, `lhci:nightly:desktop`, `lhci:nightly:mobile`.

---

## Wiki Documentation

Visit the [Wiki Documentation](https://github.com/Rightpoint/rp-react-best-practices/wiki) for more documentation.
