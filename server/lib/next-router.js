import keyMirror from '../utils/key_mirror'
import Router from 'koa-router'
import requireDir from 'require-dir'

const options = {
  routesPropKey: '$routes',
  methods: keyMirror(
    ['all', 'get', 'post', 'del', 'delete', 'patch'], {
      upperKey: true
    }),
  controllersDir: '',
  router: new Router(),
  registRoute (router, $route) {
    console.log('add route', $route)
    router[$route.method]($route.path, ...$route.middlewares)
  },
  autoLoadControllers: true,
  autoCallNext: true,
  loadControllers (options) {
    const contros = requireDir(options.controllersDir, {recurse: true})
    Object.keys(contros).map(key => {
      const Controller = contros[key].default || contros[key]
      if (Array.isArray(Controller.prototype[options.routesPropKey])) {
        return new Controller()
      }
    })
  }
}

export const HttpMethod = options.methods
HttpMethod.all = 'use'
HttpMethod.del = 'delete'

export function route (method = HttpMethod.all, path = '/', ...args) {
  return (target, name) => {
    const $routes = target[options.routesPropKey] || []
    $routes.push({
      method,
      path,
      middlewares: args.concat([async (...agrs2) => {
        await target[name](...agrs2)
        if (options.autoCallNext &&
          typeof agrs2[1] === 'function') {
          await agrs2[1]()
        }
      }])
    })
    console.log('dec route', method, options.routesPropKey)
    target[options.routesPropKey] = $routes
  }
}

const methods = Object.keys(HttpMethod).map(key => HttpMethod[key])
methods.forEach(method => (exports[method] = route.bind(null, method)))

export function controller (path = '/', ...args) {
  return target => {
    const proto = target.prototype
    console.log('dec controller', proto[options.routesPropKey])
    proto[options.routesPropKey].forEach($route => {
      $route.path = path + $route.path
      $route.middlewares = $route.middlewares.concat(args)
      options.registRoute(options.router, $route, options)
    })
  }
}

export default function (opts) {
  const methods = Object.assign(options.methods, opts.methods)
  Object.assign(options, opts)
  // don't override exported HttpMethod
  options.methods = methods
  if (options.autoLoadControllers) {
    options.loadControllers(options)
  }
  return options
}
