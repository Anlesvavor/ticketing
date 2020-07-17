import { body, validationResult } from 'express-validator';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { validateRequest, BadRequestError } from '@anlesvavortickets/common';
import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signin', [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .notEmpty()
    .withMessage('you must supply a password')
], validateRequest,
async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError('Invalid Credentials');
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials');
  }

  // Generate JWT
  const userJWT = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, process.env.JWT_KEY!);

  // Store it on session object
  req.session= { 
    jwt: userJWT
  };

  res.status(200).send({existingUser});
});

export { router as signinRouter };
