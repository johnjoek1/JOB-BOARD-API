
const jwt = require('jsonwebtoken');

const authenticate = ({ req }) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
            return decoded;
        } catch (err) {
            throw new Error('Invalid token');
        }
    }
    return null;
};

module.exports = authenticate;








































/** 
const jwt = require('jsonwebtoken');
  const { AuthenticationError } = require('apollo-server-express');

  const authenticate = (context) => {
      const authHeader = context.req.headers.authorization;
      if (!authHeader) {
          throw new AuthenticationError('No token provided');
      }

      const token = authHeader.replace('Bearer ', '');
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          return decoded; // { id, role }
      } catch (err) {
          throw new AuthenticationError('Invalid token');
      }
  };

  module.exports = authenticate;

  */