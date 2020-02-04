# Exchange Rate Currency Conversion Microservice


## pre-requisites
We recommended using Node Version Manager (NVM) to run various versions of Node.
if you don't have it already installed check it out [ Installing NVM here](https://github.com/nvm-sh/nvm)

Or just use Node v10.16.3 ( Which is what we used to test this service )

``` sh
node -v
v10.16.3
npm -v
6.9.0
```


### first clone the repo
```sh
git clone https://github.com/bee-travels/bee-travels.git
```

### install node dependancies from package.json

```sh
cd bee-travels/src/currencyexchange

npm install

#if developing, install dev Dependacies
npm install --save-dev

#build 
npm run build

#run unittests
npm run test

#run the environment in development mode
npm run dev

#additional development commands
echo "run linter"
npm run lint

echo "run code formatter"
npm run format

#run production
npm run start
```
Then simply navigate to
http://localhost:4001 and test out this microservice API endpoints using
the Swagger test harness page.



### VSCode Extension suggestions

#### Prettier - Code formatter
https://bit.ly/33e690e



[read more about Jest - a delightful JavaScript Testing Framework here](https://jestjs.io/)

moved tests out of test folder to be adjacent to files been tested - motivations:
* scale - each file should have a corresponding test file with pattern `test` or `spec`
https://kentcdodds.com/blog/colocation

uses npm lib `csvtojson` very nice as cuts down lines code drastically.

mostly using async / await over `explicit` promises.  async/await uses promises under the covers, also reduces lines of code drastically.

### resources

[The Cost of Logging - Pino vs Winston benchmarks by Matteo Collina](https://www.nearform.com/blog/the-cost-of-logging/)
