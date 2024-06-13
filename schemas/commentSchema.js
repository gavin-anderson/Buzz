import Joi from 'joi';

export const commentSchema = Joi.object({
  userId: Joi.string(),
  marketId: Joi.string(),
  commentId: Joi.string(),
  comment: Joi.string(),
  yesHeld: Joi.number(),
  noHeld: Joi.number(),
  isReply: Joi.boolean(),
  replyId: Joi.string().allow('') // Assuming empty string is acceptable for non-replies
});
