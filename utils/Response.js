const successResponse = (successMessage, res) => {
  res
    .set({ Authorization: successMessage.token })
    .status(200)
    .json({ successMessage });
};

const errorResponse = (errorMessage, res, code) => {
  res.status(code).json({ errorMessage });
};

module.exports = {
  successResponse,
  errorResponse,
};
