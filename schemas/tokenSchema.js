import Joi from 'joi';

const tokenHolderSchema = Joi.object({
  userId: Joi.string().required(),
  amount: Joi.number().required(),
});

export const tokenSchema = Joi.object({
  tokenId: Joi.string().required(),
  tokenName: Joi.string().required(),
  totalSupply: Joi.number().required(),
  priceETH: Joi.number().optional(),
  priceUSD: Joi.number().optional(),
  curveConstant: Joi.number().optional(),
  curveSupply: Joi.number().optional(),
  marketSupply: Joi.number().optional(),
  curveETH: Joi.number().optional(),
  totalTrades: Joi.number().optional(),
  volume: Joi.number().optional(),
  totalUserFees: Joi.number().optional(),
  totalProtocolFees: Joi.number().optional(),
  tokenHolders: Joi.array().items(tokenHolderSchema).required(),
});
