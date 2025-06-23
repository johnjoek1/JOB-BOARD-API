const { UserInputError } = require('apollo-server-express');
  const { check, validationResult } = require('express-validator');

  const validate = async (validations) => {
      const checks = validations.map(({ value, type, min, options, optional }) => {
          let validator = check('value').exists();
          if (optional) validator = validator.optional();
          switch (type) {
              case 'string':
                  validator = validator.isString().isLength({ min });
                  break;
              case 'email':
                  validator = validator.isEmail();
                  break;
              case 'number':
                  validator = validator.isNumeric().custom((v) => v >= (min || 0));
                  break;
              case 'enum':
                  validator = validator.isIn(options);
                  break;
              case 'array':
                  validator = validator.isArray({ min });
                  break;
          }
          return validator;
      });

      const errors = validationResult(checks.map((c) => c.run({ body: { value: validations[0].value } })));
      if (!errors.isEmpty()) {
          throw new UserInputError('Validation failed', { errors: errors.array() });
      }
  };

  module.exports = validate;