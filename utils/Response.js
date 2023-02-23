const successResponse = (successMessage, res) => {
  res
    .status(200)
    .set({ Authorization: successMessage.token })
    .json({ successMessage });
};

const errorResponse = (errorMessage, res, code) => {
  res.status(code).json({ errorMessage });
};

module.exports = {
  successResponse,
  errorResponse,
};
