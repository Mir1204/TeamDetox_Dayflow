// config/jwt.js
const jwt = require('jsonwebtoken');
const config = require('./env');

/**
 * JWT Configuration and Helper Functions
 */

// JWT Secret Keys
const JWT_SECRET = config.jwt.secret;
const JWT_REFRESH_SECRET = config.jwt.refreshSecret;

// JWT Expiry Times
const JWT_EXPIRES_IN = config.jwt.expiresIn;
const JWT_REFRESH_EXPIRES_IN = config.jwt.refreshExpiresIn;

/**
 * Generate Access Token
 * @param {Object} payload - Token payload
 * @param {string} payload.userId - User ID
 * @param {string} payload.role - User role
 * @returns {string} JWT access token
 */
const generateAccessToken = (payload) => {
  const { userId, role, email } = payload;

  return jwt.sign(
    {
      userId,
      role,
      email,
      type: 'access'
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
      issuer: config.app.name,
      audience: config.app.name
    }
  );
};

/**
 * Generate Refresh Token
 * @param {Object} payload - Token payload
 * @param {string} payload.userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  const { userId } = payload;

  return jwt.sign(
    {
      userId,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: config.app.name,
      audience: config.app.name
    }
  );
};

/**
 * Generate Both Access and Refresh Tokens
 * @param {Object} payload - Token payload
 * @returns {Object} Object containing both tokens
 */
const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: JWT_EXPIRES_IN
  };
};

/**
 * Verify Access Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: config.app.name,
      audience: config.app.name
    });

    // Check token type
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not active yet');
    }
    throw error;
  }
};

/**
 * Verify Refresh Token
 * @param {string} token - JWT refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: config.app.name,
      audience: config.app.name
    });

    // Check token type
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Decode Token Without Verification
 * Useful for getting token info without validating signature
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token or null if invalid
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return null;
  }
};

/**
 * Get Token Expiry Date
 * @param {string} token - JWT token
 * @returns {Date|null} Expiry date or null
 */
const getTokenExpiry = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Check if Token is Expired
 * @param {string} token - JWT token
 * @returns {boolean} True if expired, false otherwise
 */
const isTokenExpired = (token) => {
  try {
    const expiry = getTokenExpiry(token);
    if (!expiry) return true;
    return expiry < new Date();
  } catch (error) {
    return true;
  }
};

/**
 * Get Time Until Token Expiry
 * @param {string} token - JWT token
 * @returns {number|null} Milliseconds until expiry or null
 */
const getTimeUntilExpiry = (token) => {
  try {
    const expiry = getTokenExpiry(token);
    if (!expiry) return null;
    return expiry.getTime() - Date.now();
  } catch (error) {
    return null;
  }
};

/**
 * Extract Token from Authorization Header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return authHeader;
};

/**
 * Create Token Response Object
 * @param {Object} user - User object
 * @returns {Object} Token response with user info
 */
const createTokenResponse = (user) => {
  const tokenPair = generateTokenPair({
    userId: user._id || user.id,
    role: user.role,
    email: user.email
  });

  return {
    ...tokenPair,
    tokenType: 'Bearer',
    user: {
      id: user._id || user.id,
      employeeId: user.employeeId,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Refresh Access Token Using Refresh Token
 * @param {string} refreshToken - Valid refresh token
 * @param {Function} getUserById - Function to fetch user by ID
 * @returns {Object} New token pair
 */
const refreshAccessToken = async (refreshToken, getUserById) => {
  try {
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user from database
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    // Generate new token pair
    return generateTokenPair({
      userId: user._id || user.id,
      role: user.role,
      email: user.email
    });
  } catch (error) {
    throw new Error('Failed to refresh token: ' + error.message);
  }
};

/**
 * Blacklist Token (for logout functionality)
 * Note: This is a placeholder. In production, implement token blacklisting
 * using Redis or database to track revoked tokens
 */
const blacklistedTokens = new Set();

const blacklistToken = (token) => {
  blacklistedTokens.add(token);
  
  // Auto-remove after expiry
  const expiry = getTokenExpiry(token);
  if (expiry) {
    const timeout = expiry.getTime() - Date.now();
    setTimeout(() => {
      blacklistedTokens.delete(token);
    }, timeout);
  }
};

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

// Token validation options
const JWT_VERIFY_OPTIONS = {
  algorithms: ['HS256'],
  issuer: config.app.name,
  audience: config.app.name
};

module.exports = {
  // Configuration
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_VERIFY_OPTIONS,

  // Token Generation
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  createTokenResponse,

  // Token Verification
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,

  // Token Information
  getTokenExpiry,
  isTokenExpired,
  getTimeUntilExpiry,
  extractTokenFromHeader,

  // Token Refresh
  refreshAccessToken,

  // Token Blacklisting (basic implementation)
  blacklistToken,
  isTokenBlacklisted
};