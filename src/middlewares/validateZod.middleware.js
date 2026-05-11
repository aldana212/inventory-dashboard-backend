import z from "zod";

export const validateZod = (schema) => (req, res, next) => {
  try {

    const data = schema.parse({
      body: req.body,
      params: req.params,
    });

    req.body = data.body || req.body;
    req.params = data.params || req.params;

    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.issues?.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }
  }
};
