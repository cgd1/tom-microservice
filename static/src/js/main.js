/* global codecopy */

window.$docsify = {
  name: 'tom',
  repo: 'kikobeats/tom-microservice',
  maxLevel: 4,
  executeScript: true,
  auto2top: true,
  plugins: [
    function (hook, vm) {
      hook.ready(function () {
        codecopy('pre')
      })
    }
  ]
}
