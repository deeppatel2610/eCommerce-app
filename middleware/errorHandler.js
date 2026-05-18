/**
 * Global Error Handler Middleware
 * Catches and handles all application errors
 */

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error status and message
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "MongoError" || err.name === "MongoServerError") {
    status = 400;
    message = "Database error occurred";
  }

  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation error: " + err.message;
  }

  if (err.name === "JsonWebTokenError") {
    status = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    status = 401;
    message = "Token has expired";
  }

  if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID format";
  }

  // Handle multer file upload errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      status = 413;
      message = "File size too large";
    } else if (err.code === "LIMIT_FILE_COUNT") {
      status = 400;
      message = "Too many files";
    } else {
      message = "File upload error: " + err.message;
    }
  }

  // Send error response
  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
