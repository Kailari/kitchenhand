import { Handler } from 'express'

const sslRedirect = (environments = ['production'], status = 302): Handler => {
  return (req, res, next) => {
    if (environments.indexOf(process.env.NODE_ENV || 'production') >= 0) {
      if (req.headers['x-forwarded-proto'] != 'https') {
        res.redirect(status, `https://${req.hostname}${req.originalUrl}`)
      } else {
        return next()
      }
    } else {
      return next()
    }
  }
}

export {
  sslRedirect
}
