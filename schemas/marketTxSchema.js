import Joi from 'joi';

export const marketTransactionSchema = Joi.object({
  marketId: Joi.string().required(),
  creatorId: Joi.string().required(),
  traderId: Joi.string().required(),
  transactionId: Joi.string().required(),
  isMint: Joi.boolean().required(),
  isfinalRedeem: Joi.boolean().required(),
  tokensAmount: Joi.number().required(),
  priceBefore: Joi.number(),
  priceAfter: Joi.number(),
  yesPoolBefore: Joi.number(),
  yesPoolAfter: Joi.number(),
  noPoolBefore: Joi.number(),
  noPoolAfter: Joi.number(),
  tokensBurned: Joi.number(),
  yesAmount: Joi.number(),
  noAmount: Joi.number(),
});
