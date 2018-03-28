'use strict';

const co     = require('co');
const notify = require('../lib/notify');
const log    = require('../lib/log');

module.exports.handler = co.wrap(function* (event, context, cb) {
  let order = JSON.parse(event.Records[0].Sns.Message);
  order.retried = true;

  let logContext = {
    orderId: order.orderId,
    restaurantName: order.restaurantName,
    userEmail: order.userEmail,
    retry: true
  };

  try {
    yield notify.userOfOrderAccepted(order);
    cb(null, "all done");
  } catch (err) {
    log.warn('failed to notify user of accepted order', logContext, err);

    cb(err);
  }
});