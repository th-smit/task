const successResponse = (successMessage, res) => {
  res.json({ successMessage }).status(200);
};

const errorResponse = (errorMessage, res, statusCode) => {
  res.status(statusCode).json({ errorMessage });
};

module.exports = {
  successResponse,
  errorResponse,
};
