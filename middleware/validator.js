const { body, validationResult } = require('express-validator');

// Middleware de contrôle des entrées
exports.inputValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next()
};
