# Vue! Jwt! Mongo!
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dubov94/vue-jwt-mongo/blob/master/LICENSE)
[![Dependencies](https://david-dm.org/dubov94/vue-jwt-mongo.svg)](https://david-dm.org/dubov94/vue-jwt-mongo)
[![Build](https://travis-ci.org/dubov94/vue-jwt-mongo.svg?branch=master)](https://travis-ci.org/dubov94/vue-jwt-mongo)
[![Coverage](https://codecov.io/gh/dubov94/vue-jwt-mongo/branch/master/graph/badge.svg)](https://codecov.io/gh/dubov94/vue-jwt-mongo)

This [package](https://www.npmjs.com/package/vue-jwt-mongo) is aimed for bootstrapping a simple JSON Web Token based authentication system using [Vue.js](https://vuejs.org/), [MongoDB](https://www.mongodb.com/) and [Express.js](https://expressjs.com/).

## Server
```javascript
const app = require('express')()

const vjmServer = require('vue-jwt-mongo').Server({
  mongoUrl: 'mongodb://localhost/db',
  jwtSecret: 'shhh'
})

app.post('/auth/register', vjmServer.registerHandler)
app.post('/auth/login', vjmServer.loginHandler)
app.post('/auth/refresh', vjmServer.refreshHandler)
app.get('/protected', vjmServer.jwtProtector, (request, response) => {
    console.log(request.user.username)
})
```

### Options
* `mongoUrl` (mandatory): address of Mongo database. Used for `mongoose.createConnection`.
* `jwtSecret` (mandatory): secret key for tokens generation. Used for `jsonwebtoken.sign`. You can get one [here](https://www.grc.com/passwords.htm).
* `userModelName`: name of [mongoose](http://mongoosejs.com/) model that is used for storing encoded user credentials. Defaults to `User`.
* `jwtExpiresIn`: tokens expiration time in seconds. Used for `jsonwebtoken.sign`. Defaults to one week.

## Client
```javascript
Vue.use(require('vue-resource'))
Vue.use(require('vue-jwt-mongo').Client, { /* options */ })

this.$auth.register('login', 'pass').then(...)
this.$auth.logIn('login', 'pass').then(...)
this.$auth.refresh().catch(...)
this.$auth.isLoggedIn()
this.$auth.logOut()
```
```javascript
/* token or null */
this.$auth.getToken()
```
```javascript
/* Authorization: Bearer XXX */
this.$http.get('/protected', { bearer: true }).then(...)
```

### Options
* `registerEndpoint`: server endpoint for registration. Defaults to `/auth/register`.
* `loginEndpoint`: server endpoint for authentication. Defaults to `/auth/login`.
* `refreshEndpoint`: server endpoint for token refresh. Defaults to `/auth/refresh`.
* `storageKey`: localStorage key used for saving a token. Defaults to `jsonwebtoken`.
* `bearerLexem`: a lexem prepending tokens in Authorization headers. Defaults to `Bearer `.
