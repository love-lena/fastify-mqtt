'use strict'

const fp = require('fastify-plugin')
const mqtt = require('mqtt')

function decorateFastifyInstance (fastify, client, next) {
  fastify.addHook('onClose', () => {
    client.end()
  })

  if (!fastify.mqtt) {
    fastify.decorate('mqtt', client)
  } else {
    next(new Error('fastify-mqtt has already registered'))
    return
  }

  next()
}

function fastifyMQTT (fastify, options, next) {
  const host = options.host
  delete options.host

  const client = mqtt.connect(host, options)

  client.on('connect', () => {
    decorateFastifyInstance(fastify, client, next)
  })
}

module.exports = fp(fastifyMQTT, {
  fastify: '>=1.0.0',
  name: 'fastify-mqtt'
})
