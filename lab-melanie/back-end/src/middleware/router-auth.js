'use strict'

import {Router} from 'express'
import User from '../model/user.js'
import parserBody from './parser-body.js'
import {basicAuth} from './parser-auth.js'
import {log, daysToMilliseconds} from '../lib/util.js'

export default new Router()
.post('/signup', parserBody, (req, res, next) => {
  log('__ROUTE__ POST /signup')
  new User.create(req.body)
  .then(user => user.tokenCreate())
  .then(token => {
    res.cookie('signup', token, {maxAge: 900000, secure: true})
    res.send(token)
  })
  .catch(next)
})
.get('/usernames/:username', (req, res, next) => {
  User.findOne({username: req.params.username})
  .then(user => {
    if(!user)
      return res.sendStatus(200)
    return res.sendStatus(409)
  })
  .catch(next)
})
.get('/login', basicAuth, (req, res, next) => {
  log('__ROUTE__ GET /login')
  req.user.tokenCreate()
  .then((token) => {
    let cookieOptions = {maxAge: daysToMilliseconds(7)}
    res.cookie('login', token, { secure: true })
    res.send(token)
  })
  .catch(next)
})