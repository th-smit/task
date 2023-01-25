const successResponse = (successMessage, res) => {
  res.status(200).json({ successMessage });
};

const errorResponse = (errorMessage, res, code) => {
  res.status(code).json({ errorMessage });
};

module.exports = {
  successResponse,
  errorResponse,
};
