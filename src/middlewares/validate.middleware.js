export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // validamos
    next();
  } catch (error) {
    res.status(400).json({
      message: "Validation error",
      errors: err.errors,
    });
  }
};
