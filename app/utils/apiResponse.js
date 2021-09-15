/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {object | array} data
 */
exports.success = (message, data) => {
  return {
    message,
    error: false,
    data
  };
};

/**
 * @desc    Send any error response
 *
 * @param   {string} message
 */
exports.error = message => {
  return {
    message,
    error: true
  };
};

/**
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
exports.validation = (errors) => {
  return {
    message: "Validation errors",
    error: true,
    errors
  };
};
