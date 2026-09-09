import { z } from "zod";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: " validation failed",
        error: result.error.flatten().fieldErrors,
      });
    }
  };
};

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  });

export const createAccountValidation = z.object({
  userName: z.string().trim(),
  firstName: z.string().min(1).max(12),
  lastName: z.string().min(1).max(12).trim(),
  email: z.email(),
  password: z.string().min(8),
});

export const addPostsValidation = z.object({
  caption: z.string().trim().optional(),
  imgUrl: z.string().trim(),
  tagPeople: z.array(objectIdSchema).optional(),
  allowComment: z.boolean().optional(),
  sharePostWith: z.enum(["FOLLOWERS", "CLOSE_FRIENDS"]).optional(),
  comments: z.array(objectIdSchema).optional(),
});

export const followValidation = z.object({
  follower: objectIdSchema,
  following: objectIdSchema,
});

export const followRequestSchemaValidation = z.object({
  requestUser: objectIdSchema,
  receppient: objectIdSchema,
  result: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
});
