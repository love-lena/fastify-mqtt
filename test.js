'use strict'

const t = require('tap')
const { test } = t
const Fastify = require('fastify')
const fastifyMQTT = require('./index')

const TEST_BROKER_URL_UNAUTHENTICATED = 'tcp://test.mosquitto.org:1883'
const TEST_BROKER_URL_AUTHENTICATED = 'tcp://test.mosquitto.org:1884'
const RW_USERNAME = 'rw'
const RW_PASSWORD = 'readwrite'

test('connect unauthenticated', t => {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyMQTT, {
    host: TEST_BROKER_URL_UNAUTHENTICATED
  }).ready(err => {
    t.error(err)
    t.ok(fastify.mqtt.connected)
  })
})

test('connect authenticated', t => {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyMQTT, {
    host: TEST_BROKER_URL_AUTHENTICATED,
    username: RW_USERNAME,
    password: RW_PASSWORD
  }).ready(err => {
    t.error(err)
    t.ok(fastify.mqtt.connected)
  })
})

test('pub/sub unauthenticated', t => {
  t.plan(6)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyMQTT, {
    host: TEST_BROKER_URL_UNAUTHENTICATED
  }).ready(err => {
    t.error(err)
    t.ok(fastify.mqtt.connected)

    const testTopic = 'fastifymqtt/tests'
    const testString = 'test1'

    fastify.mqtt.on('message', function (topic, message) {
      t.equal(topic, testTopic)
      t.equal(message.toString(), testString)
    })

    fastify.mqtt.subscribe(testTopic, testString, {}, (err) => t.error(err))
    fastify.mqtt.publish(testTopic, testString, {}, (err) => t.error(err))
  })
})

test('pub/sub authenticated', t => {
  t.plan(6)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyMQTT, {
    host: TEST_BROKER_URL_AUTHENTICATED,
    username: RW_USERNAME,
    password: RW_PASSWORD
  }).ready(err => {
    t.error(err)
    t.ok(fastify.mqtt.connected)

    const testTopic = 'fastifymqtt/tests'
    const testString = 'test1'

    fastify.mqtt.on('message', function (topic, message) {
      t.equal(topic, testTopic)
      t.equal(message.toString(), testString)
    })

    fastify.mqtt.subscribe(testTopic, testString, {}, (err) => t.error(err))
    fastify.mqtt.publish(testTopic, testString, {}, (err) => t.error(err))
  })
})

test('double register', t => {
  t.plan(2)

  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify
    .register(fastifyMQTT, { host: TEST_BROKER_URL_UNAUTHENTICATED })
    .register(fastifyMQTT, { host: TEST_BROKER_URL_UNAUTHENTICATED })
    .ready(err => {
      t.ok(err)
      t.equal(err.message, 'fastify-mqtt has already registered')
    })
})
