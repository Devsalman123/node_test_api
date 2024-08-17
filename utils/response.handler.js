const { SUCCESS, INTERNAL_SERVER_ERROR } = require("../constant/error.code");
const { SERVER_ERROR } = require("../constant/error.message");

const sendSuccess = (res, data, message = "Success", statusCode = SUCCESS) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

const sendError = (
  res,
  message = SERVER_ERROR,
  statusCode = INTERNAL_SERVER_ERROR,
  error = null
) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    error,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
