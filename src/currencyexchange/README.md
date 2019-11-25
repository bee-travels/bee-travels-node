# Exchange Rate Currency Conversion Microservice


## pre requisites
We recommended to run various versions of Node/npm is via NVM ( Node Version Manager )
if you don't have it already installed check it out [ Installing NVM here](https://github.com/nvm-sh/nvm)

Or just use Node v10.16.3 ( what we used to test this service )

``` sh
node -v
v10.16.3
npm -v
6.9.0
```

### notes

After research and chats with other coders / mentors on JS, I deciced to use Jest as test library over Mocha/Chai/Sinon for testing for a few reasons, nonewithstanding:
( npm install jest --save-dev )
* modern
* debug easier
* control output with many options ( + nice compares )
* selectively run tests
* runs tests in paralell

[read more about Jest - a delightful JavaScript Testing Framework here](https://jestjs.io/)

moved tests out of test folder to be adjacent to files been tested - motivations:
* scale - each file should have a corresponding test file with pattern `test` or `spec`
https://kentcdodds.com/blog/colocation

uses npm lib `csvtojson` very nice as cuts down lines code drastically.

mostly using async / await over `explicit` promises.  async/await uses promises under the covers, also reduces lines of code drastically.

### to dos:

* add git pre-commit hooks https://pre-commit.com/

* add supertest for `smoke` tests ( call ext API ) https://www.npmjs.com/package/supertest

* move last vestigages of promises to asynyc/await in router.js


### install node dependancies from package.json

```sh
npm install

#if developing, install devDependacies
npm install --save-dev
```

### run tests

```sh
echo "build to dist folder"
npm run build

echo "run tests"
npm run test

npm run start
npm run dev

echo "run linter"
npm run lint

echo "run code formatter"
npm run format

#code reloader using Jest
npm run test:watch
```

## VSCode Extension suggestions

### Prettier - Code formatter
https://bit.ly/33e690e

### nodeJS debugging in VSCode
