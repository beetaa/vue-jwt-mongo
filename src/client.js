'use strict'

module.exports = function(Vue, options) {
    const merge = require('merge')
    const jwtDecode = require('jwt-decode')

    const sToMs = (seconds) => {
        return seconds * 1000
    }

    const defaultOptions = {
        registerEndpoint: '/auth/register',
        loginEndpoint: '/auth/login',
        storageKey: 'jsonwebtoken',
        bearerLexem: 'Bearer '
    }

    options = merge(defaultOptions, options)

    const Token = new function() {
        this.get = () => {
            return localStorage.getItem(options.storageKey)
        }

        this.set = (value) => {
            localStorage.setItem(options.storageKey, value)
        }

        this.remove = () => {
            localStorage.removeItem(options.storageKey)
        }

        this.valid = () => {
            let token = this.get()
            if (token !== null) {
                let tokenExpMs = sToMs(jwtDecode(token).exp)
                let nowMs = new Date().getTime()
                return tokenExpMs - nowMs > sToMs(60)
            } else {
                return false
            }
        }
    }


    function Auth(instance) {
        this.register = (username, password, successCallback, errorCallback) => {
            instance.$http
                .post(options.registerEndpoint, { username, password })
                .bind(instance)
                .then(successCallback, errorCallback)
        }

        this.logIn = (username, password, successCallback, errorCallback) => {
            instance.$http
                .post(options.loginEndpoint, { username, password })
                .bind(instance)
                .then(function(response) {
                    Token.set(response.text())
                    successCallback.call(this)
                }, errorCallback)
        }

        this.logOut = Token.remove
        this.isLoggedIn = Token.valid
        this.getToken = Token.get
    }

    Object.defineProperty(Vue.prototype, '$auth', {
        get: function() {
            return new Auth(this)
        }
    })

    Vue.http.interceptors.push(function(request, next) {
        if (request.bearer) {
            if (!Token.valid()) {
                return next(request.respondWith(null, {
                    status: 401,
                    statusText: 'Request demands JWT but user was not logged in'
                }))
            } else {
                request.headers.Authorization = options.bearerLexem + Token.get()
                return next()
            }
        } else {
            return next()
        }
    })
}
