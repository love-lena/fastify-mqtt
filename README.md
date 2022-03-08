# fastify-mqtt

[![NPM version](https://img.shields.io/npm/v/fastify-mqtt.svg?style=flat)](https://www.npmjs.com/package/fastify-mqtt)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Fastify MQTT plugin; shares the same MQTT connection in every part of your server.

Wrapper around [mqtt](https://www.npmjs.com/package/mqtt)

## Install

```
npm i fastify-mqtt
```

## Usage
Add it to your project with `register` and you are done!  

```js
const fastify = require('fastify')()

fastify.register(require('fastify-mqtt'), {  
  host: 'http://mybroker:port'
  //Add more options here
})

fastify.get('/user/:id', function (req, reply) {
  this.mqtt.publish('my/topic', 'user id requested')

  reply.send()
})

fastify.listen(3000, err => {
  if (err) throw err
})
```

## License

Licensed under [MIT](./LICENSE).
