import Joi from 'joi';

export const tokenTxSchema = Joi.object({
  tokenId: Joi.string().required(),
  traderId: Joi.string().required(),
  transactionHash: Joi.string().required(),
  buySell: Joi.boolean().allow(null).required(),
  amountIn: Joi.number().required(),
  amountOut: Joi.number().required(),
  priceBefore: Joi.number(),
  priceAfter: Joi.number(),
  curveConstantBefore: Joi.number(),
  curveConstantAfter: Joi.number(),
  userFees: Joi.number(),
  protocolFees: Joi.number(),
  isTransfer: Joi.boolean().required(),
  transferTo: Joi.string(),
  transferFrom: Joi.string()
});
