module.exports = [
  {
    method: 'POST',
    path: '/route/bindToDB',
    handler: 'RouteController.bindToDB'
  },
  {
    method: 'POST',
    path: '/route/bindToFL',
    handler: 'RouteController.bindToFL'
  }
]
