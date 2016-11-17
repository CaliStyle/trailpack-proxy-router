module.exports = [
  {
    method: 'POST',
    path: '/route/buildToDB',
    handler: 'RouteController.buildToDB'
  },
  {
    method: 'POST',
    path: '/route/buildToFL',
    handler: 'RouteController.buildToFL'
  }
]
