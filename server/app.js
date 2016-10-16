import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import session from 'koa-session'
import views from 'koa-views'
import convert from 'koa-convert'
import serve from 'koa-static'
import finalHandler from './middlewares/finalHandler'
import NextRouter from './lib/next-router'

const router = NextRouter({
  controllersDir: `${__dirname}/controllers`
})

const app = new Koa()

app.use(finalHandler())
app.use(views(`${__dirname}/views/`, {
  map: {
    html: 'nunjucks'
  }
}))
app.use(logger())
app.use(bodyParser())
app.keys = ['some secret hurr']
app.use(convert(session(app)))
app.use(serve('public'))
app
  .use(router.router.routes())
  .use(router.router.allowedMethods())

const PORT = 3000
app.listen(PORT)
console.log(`listening on port ${PORT}`)

export default app
