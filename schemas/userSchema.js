import Joi from 'joi';

const tokenOwnedSchema = Joi.object({
  tokenId: Joi.string().allow(null),
  amount: Joi.number().allow(null),
});

export const userSchema = Joi.object({
  walletAddress: Joi.string().required(),
  privy_id: Joi.string().required(),
  username: Joi.string().required(),
  profileName: Joi.string().required(),
  email: Joi.string().email().required(),
  createdAt: Joi.date().required(),
  tokensOwned: Joi.array().items(tokenOwnedSchema).optional(),
});
