# DrinkRank
Repository for SER517-Group20 for DrinkRank project

## Install front-end project

1. Download and install [Node.js](https://nodejs.org/en/download) (with built-in nmp) 

2. Install the lastest Angular-Cli with command `npm install -g @angular/cl`.

3. Under the root of front-end, use command `npm intall` to install the reqired modules.

4. Under the root of front-end, use command `ng serve` to preview the front-end.
   The default host is `localhost:4200`.

5. Use command `ng build` to build. The built result is under `/dist/`.

6. A deployment script `/scripts/deploy.js` is created. 
   Follow the setup guide inside `deploy.js` and use `npm run deploy` to build and deploy to AWS S3.

## Using the Application

1. Go to[this](http://drink-rank-dev.s3-website-us-west-2.amazonaws.com/)link.

## Reference
Original template for the front-end:
https://github.com/cornflourblue/angular2-registration-login-example

