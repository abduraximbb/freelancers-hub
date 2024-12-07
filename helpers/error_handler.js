const errorHandler = (res, error) => {
  // console.log(error);

  res.status(500).send({ error: error.message });
};

module.exports = {
  errorHandler,
};
