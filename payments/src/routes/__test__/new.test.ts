import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@anlesvavortickets/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

// jest.mock('../../stripe');

it('retuns a 404 then purchasin an order that does not exist', async () => {
  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({
    token: '123',
    orderId: mongoose.Types.ObjectId().toHexString()
  })
  .expect(404);
});

it('retuns a 401 when purchasing an order that doesnt belongs to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({
    token: 'asd',
    orderId: order.id,
  })
  .expect(401);

});

it('returns a 400 when purchasin a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({
    orderId: order.id,
    token: '12312123'
  })
  .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin(userId))
  .send({
    token: 'tok_visa',
    orderId: order.id,
  })
  .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });
  expect(payment).not.toBeNull();
});
