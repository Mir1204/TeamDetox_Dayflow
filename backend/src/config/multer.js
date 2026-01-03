const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { FILE_UPLOAD } = require('../utils/constants');

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';

    // Determine upload path based on field name
    if (file.fieldname === 'profilePicture') {
      uploadPath = 'uploads/profiles/';
    } else if (file.fieldname === 'document' || file.fieldname === 'attachments') {
      uploadPath = 'uploads/documents/';
    } else {
      uploadPath = 'uploads/others/';
    }

    // Ensure directory exists
    ensureDirectoryExists(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    
    // Sanitize filename (remove special characters)
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Determine allowed types based on field name
  let allowedTypes = [];

  if (file.fieldname === 'profilePicture') {
    allowedTypes = FILE_UPLOAD.ALLOWED_IMAGE_TYPES;
  } else if (file.fieldname === 'document' || file.fieldname === 'attachments') {
    allowedTypes = [
      ...FILE_UPLOAD.ALLOWED_IMAGE_TYPES,
      ...FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES
    ];
  } else {
    allowedTypes = [
      ...FILE_UPLOAD.ALLOWED_IMAGE_TYPES,
      ...FILE_UPLOAD.ALLOWED_DOCUMENT_TYPES
    ];
  }

  // Check if file type is allowed
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE, // 5MB
    files: 5 // Maximum 5 files at once
  },
  fileFilter: fileFilter
});

// Specific upload configurations
const uploadProfilePicture = upload.single('profilePicture');
const uploadDocument = upload.single('document');
const uploadDocuments = upload.array('documents', 5);
const uploadAttachments = upload.array('attachments', 3);

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size is too large. Maximum size is 5MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field in form data.'
      });
    }
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }
  
  next();
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file URL
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  
  // If it's already a full URL, return it
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }
  
  // Otherwise, construct URL
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/${filePath.replace(/\\/g, '/')}`;
};

module.exports = {
  upload,
  uploadProfilePicture,
  uploadDocument,
  uploadDocuments,
  uploadAttachments,
  handleMulterError,
  deleteFile,
  getFileUrl
};