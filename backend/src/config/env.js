// config/env.js
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(
  envVar => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  process.exit(1);
}

// Export environment configuration
const config = {
  // Server Configuration
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`,

  // Database Configuration
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
  },

  // Frontend Configuration
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
    verificationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email`,
    resetPasswordUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password`
  },

  // Application Configuration
  app: {
    name: process.env.APP_NAME || 'HRMS',
    version: '1.0.0'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    allowedDocumentTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    authWindowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5
  },

  // Security Configuration
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10,
    passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
    sessionSecret: process.env.SESSION_SECRET || 'your-session-secret-change-this',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },

  // Token Expiry Configuration
  tokenExpiry: {
    emailVerification: 24 * 60 * 60 * 1000, // 24 hours
    passwordReset: 1 * 60 * 60 * 1000 // 1 hour
  },

  // Pagination Configuration
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100
  },

  // Leave Configuration
  leave: {
    quotas: {
      Paid: parseInt(process.env.PAID_LEAVE_QUOTA) || 15,
      Sick: parseInt(process.env.SICK_LEAVE_QUOTA) || 10,
      Casual: parseInt(process.env.CASUAL_LEAVE_QUOTA) || 7,
      Maternity: parseInt(process.env.MATERNITY_LEAVE_QUOTA) || 90,
      Paternity: parseInt(process.env.PATERNITY_LEAVE_QUOTA) || 7,
      Unpaid: 999 // Unlimited
    }
  },

  // Working Hours Configuration
  workingHours: {
    fullDay: 8,
    halfDay: 4,
    standardStart: '09:00',
    standardEnd: '18:00'
  },

  // Feature Flags
  features: {
    emailVerificationRequired: process.env.EMAIL_VERIFICATION_REQUIRED !== 'false',
    allowBulkUpload: process.env.ALLOW_BULK_UPLOAD === 'true',
    enableNotifications: process.env.ENABLE_NOTIFICATIONS !== 'false',
    enableFileUpload: process.env.ENABLE_FILE_UPLOAD !== 'false'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined'
  }
};

// Validation helper
const validateConfig = () => {
  // Validate JWT secret length
  if (config.jwt.secret.length < 32) {
    console.warn('⚠️  Warning: JWT_SECRET should be at least 32 characters long');
  }

  // Validate email configuration if notifications are enabled
  if (config.features.enableNotifications) {
    if (!config.email.user || !config.email.password) {
      console.warn('⚠️  Warning: Email credentials not configured. Email notifications will fail.');
    }
  }

  // Validate MongoDB URI format
  if (!config.mongodb.uri.startsWith('mongodb://') && !config.mongodb.uri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format');
    process.exit(1);
  }
};

// Run validation in non-test environments
if (process.env.NODE_ENV !== 'test') {
  validateConfig();
}

// Helper function to check if in development mode
config.isDevelopment = () => config.node_env === 'development';

// Helper function to check if in production mode
config.isProduction = () => config.node_env === 'production';

// Helper function to check if in test mode
config.isTest = () => config.node_env === 'test';

// Display configuration summary (only in development)
if (config.isDevelopment()) {
  console.log('\n📋 Configuration Summary:');
  console.log('   Environment:', config.node_env);
  console.log('   Port:', config.port);
  console.log('   Base URL:', config.baseUrl);
  console.log('   Frontend URL:', config.frontend.url);
  console.log('   Email Notifications:', config.features.enableNotifications ? 'Enabled' : 'Disabled');
  console.log('   Email Verification:', config.features.emailVerificationRequired ? 'Required' : 'Optional');
  console.log('');
}

module.exports = config;