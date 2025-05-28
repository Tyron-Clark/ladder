export const errorHandler = (err, req, res, next) => {
  console.error("Error stack:", err.stack);

  // Default
  let error = {
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  };

  // Blizzard API
  if (err.message.includes("Blizzard API error")) {
    error = {
      message: "Failed to fetch data from Blizzard API",
      status: 502,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    };
  }

  // Authentication
  if (err.message.includes("access token")) {
    error = {
      message: "API authentication failed",
      status: 503,
    };
  }

  res.status(error.status).json({
    error: error.message,
    ...err(error.details && { details: error.details }),
    timestamp: new Date().toISOString(),
  });
};
