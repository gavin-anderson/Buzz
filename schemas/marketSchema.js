import Joi from 'joi';
import { commentSchema } from './commentSchema'; // Assuming you've already converted this schema

const marketOptionSchema = Joi.object({
  A: Joi.string().required(),
  B: Joi.string().required(),
});

export const marketSchema = Joi.object({
  creatorAddress: Joi.string().required(), // Made required
  marketAddress: Joi.string().required(), // Made required
  marketType: Joi.string().required(), // Made required
  postMessage: Joi.string().required(),
  options: Joi.array().items(marketOptionSchema).required(),
  totalComments: Joi.number().integer().min(0).default(0),
  totalVolume: Joi.number().min(0).default(0),
  totalBettors: Joi.number().integer().min(0).default(0),
  K: Joi.number().required(), // Made required
  expiry: Joi.date().required(), // Made required
  isSettled: Joi.boolean().default(false),
  settledAt: Joi.date().allow(null).required(),
  settleMessage: Joi.string().allow(null).required(),
  supplyChange: Joi.number().required(), // Made required
  reportedValue: Joi.string().allow(null).required(),
  isReportedValue: Joi.boolean().default(false),
  claimed: Joi.number().min(0).default(0),
  unclaimed: Joi.number().min(0).default(0),
  createdAt: Joi.date().required(),
  comments: Joi.array().items(commentSchema).required(),
});
