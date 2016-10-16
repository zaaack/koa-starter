import BaseController from './BaseController'
import { controller, get, post } from '../../lib/next-router'

@controller('/user')
export default class UserController extends BaseController {

  @get('/:id')
  async get (ctx, next) {
    console.log('user get')
    await ctx.render('index')
    console.log('user get rendered')
  }
}
