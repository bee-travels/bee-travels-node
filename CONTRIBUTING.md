# Contributing
## Yarn 2+
This project uses Yarn 2, if you are adding or removing dependencies you **must** use yarn.
You don't need to worry about what version of yarn you are using. Starting with Yarn 2, the version of yarn is locked by the project.
As long as you have yarn installed, it will be the right version.

We are experimenting with Yarn 2's `Zero Install` theology;
this means you shouldn't ever need to run `yarn install` (and **never** run `npm install`).

We also take advantage of yarn workspaces and constaints.

## Code editor
We recommend using Visual Studio Code for development.
We also recommend installing the ESLint and Prettier VSCode extensions.

## Branch Organization
> **Note:** Still being discussed.

#### Option 1
Submit all changes directly to the [master branch](https://github.com/bee-travels/bee-travels-node/tree/master/).
We don't use separate branches for development or for upcoming releases.
We do our best to keep `master` in good shape, with all tests passing.

We should be able to release a new version from the tip of `master` at any time.

#### Option 2
We have 3 "master branches":
1. [v1](https://github.com/bee-travels/bee-travels-node/tree/v1/) (basic)
1. [v2](https://github.com/bee-travels/bee-travels-node/tree/v2/) (with-database)
1. [v3](https://github.com/bee-travels/bee-travels-node/tree/v3/) (with-mqtt)

Submit all changes directly to one of these branches.
We don't use separate branches for development or for upcoming releases.
We do our best to keep `v1`, `v2` and `v3` in good shape, with all tests passing.

We should be able to release a new version from the tip of `v1`, `v2` and `v3` at any time.

#### Option 3
We have 6 branches:
1. [v1](https://github.com/bee-travels/bee-travels-node/tree/v1/) (basic)
1. [v2](https://github.com/bee-travels/bee-travels-node/tree/v2/) (with-database)
1. [v3](https://github.com/bee-travels/bee-travels-node/tree/v3/) (with-mqtt)
1. [v1-dev](https://github.com/bee-travels/bee-travels-node/tree/v1-dev/) (basic-dev)
1. [v2-dev](https://github.com/bee-travels/bee-travels-node/tree/v2-dev/) (with-database-dev)
1. [v3-dev](https://github.com/bee-travels/bee-travels-node/tree/v3-dev/) (with-mqtt-dev)

Submit all changes to the offiliated `dev` branch.
Merges into `master` are treated as a release and only PRs from `dev` will be merged.

## Proposing a Change
If you intend to make any non-trivial changes, we recommend filing an issue.
This lets us reach an agreement on your proposal before you put significant effort into it.

If you're only fixing a bug, it's fine to submit a pull request right away but we still recommend to file an issue detailing what you're fixing.
This is helpful in case we don't accept that specific fix but want to keep track of the issue.

## Your First Pull Request
To help you get your feet wet and get you familiar with our contribution process, we have a list of good first issues that contain bugs that have a relatively limited scope.
This is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix.
If nobody is working on it at the moment,
please leave a comment stating that you intend to work on it so other people don't accidentally duplicate your effort.

If somebody claims an issue but doesn't follow up for more than two weeks,
it's fine to take it over but you should still leave a comment.

## Sending a Pull Request
Before submitting a pull request, please make sure the following is done:

1. Fork [the repository](https://github.com/bee-travels/bee-travels-node) and create your branch from `master`.
1. (**don't** run npm install!).
1. If you've fixed a bug or added code that should be tested, add tests!
1. Ensure the test suite passes (`yarn test`).
1. Format your code with [prettier](https://github.com/prettier/prettier/) (`yarn prettier`).
1. Make sure your code lints (`yarn lint`).

We will review your pull request and either merge it, request changes to it, or close it with an explanation.

## Contribution Prerequisites
* You have [Node](https://nodejs.org/) v10+ and [Yarn](https://yarnpkg.com/) installed.
* You are familiar with Git.

## Style Guide
We use an automatic code formatter called [Prettier](https://prettier.io/).
Run `yarn prettier` after making any changes to the code.

Then, our linter will catch most issues that may exist in your code.
You can check the status of your code styling by simply running `yarn lint`.

## Project Structure
Bee Travels is a monorepo.
Its repository contains multiple separate packages so that their changes can be coordinated together, and issues live in one place.

After cloning the Bee Travels Node.js repository, you should see the following high-level structure:
```markdown
🐝bee-travels-node
 ┣ 📂.travis <!-- travis related scripts -->
 ┣ 📂.vscode <!-- shouldn't need to touch -->
 ┣ 📂.yarn <!-- shouldn't need to touch -->
 ┣ 📂screenshots <!-- images for README -->
 ┗ 📂services
   ┣ 📂ui
   ┃ ┣ 📂backend <!-- ui-backend -->
   ┃ ┗ 📂frontend <!-- ui-frontend -->
   ┣ 📂hotel <!-- hotel -->
   ┣ 📂destination <!-- destination -->
   ┗ 📂currency-exchange <!-- currency-exchange -->
```

> **Note:** See individual service READMEs for a deeper overview of project structure.

## Docker
Their are 5 Dockerfiles affiliated with the project.

### Base
The base Dockerfile is located in the root directory and needs to be built before building any other image.
The image includes the yarn cache and lock required for building all other services.

### UI
The UI Dockerfile is located in `services/ui` and encapsulates both the `ui-frontend` and `ui-backend` workspaces.

### Hotel Service
The Hotel Service Dockerfile is located in `services/hotel` and encapsulates the `hotel` workspace.

### Destination Service
The Destination Service Dockerfile is located in `services/destination` and encapsulates the `destination` workspace.

### Currency Exchange
The Currency Exchange Dockerfile is located in `services/currency-exchange` and encapsulates the `currency-exchange` workspace.

## Collocated Tests
We don't have a top-level directory for unit tests. Instead, we put them next to the files that they test.

For example, a test for `app.js` is located right next to it as `app.test.js`.
