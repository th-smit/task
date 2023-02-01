const successResponse = (successMessage, res) => {
  res.status(200).send({ successMessage });
};

const errorResponse = (errorMessage, res, code) => {
  console.log(code);
  res.status(code).json({ errorMessage });
};

module.exports = {
  successResponse,
  errorResponse,
};
