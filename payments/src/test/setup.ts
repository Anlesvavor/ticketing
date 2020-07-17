import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[]
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;

process.env.STRIPE_KEY = 'sk_test_51H5JdlJXZ8aAmccqFBcB5JY0E7a1mo9cZACGeyfkz778UTzr8lzbx07EEUTgyXNFGUvw2r3SKQW1K4KTVKyFGDG100UHKvHCB4';

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf',
  process.env.NODE_TLS_REJECT_UNATHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. {id, email}uuu
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"

  }
  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: my_jwt }
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode is as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return  [`express:sess=${base64}`];
}
