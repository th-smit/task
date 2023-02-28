const Show = require("../models/showModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addShowValidation,
  updateShowValidation,
} = require("../middleware/validationMiddleware");

const getShow = async (req, res) => {
  try {
    const st = new Date(req.query.date);
    st.setHours(0);
    st.setMinutes(0);
    st.setSeconds(0);
    st.setMilliseconds(0);

    const ed = new Date(req.query.date);
    ed.setDate(st.getDate() + 1);

    const ct = new Date();
    console.log("hello from the get ");
    console.log("date formate " + req.query.date);
    console.log(req.query.title);
    const sortedData = await Show.find({
      title: req.query.title,
      datetime: { $gt: st, $gte: ct, $lt: ed },
    });
    successResponse(sortedData, res);
  } catch (err) {
    errorResponse(err, res, 404);
  }
};

const addShow = async (req, res) => {
  console.log("body data" + JSON.stringify(req.body));
  console.log("show date " + req.body.datetime);
  console.log(typeof new Date(req.body.datetime));
  try {
    const existData = await Show.find({
      title: req.body.title,
      datetime: new Date(req.body.datetime),
    });
    if (!(existData.length == 0)) {
      errorResponse({ err: "already show exist on selected date" }, res, 501);
    } else {
      const value = await addShowValidation.validateAsync(req.body);
      console.log(value);

      if (value) {
        const sethm = new Date(req.body.datetime);
        sethm.setSeconds(0);
        sethm.setMilliseconds(0);
        const dataObj = new Show({
          title: req.body.title,
          datetime: sethm,
        });
        console.log("showObj " + dataObj);
        const showData = await dataObj.save();
        successResponse(showData, res);
      }
    }
  } catch (err) {
    errorResponse(err, res, 501);
  }
};

const updateShow = async (req, res) => {
  console.log("from backend" + req.body);
  //console.log("movie id " + req.body.movieid);
  console.log("show date " + req.body.datetime);
  console.log(typeof req.body.datetime);

  try {
    const moviesData = await Show.findOne({ _id: req.params.id });
    console.log(moviesData);
    if (!moviesData) {
      errorResponse("id does not exist", res, 404);
    } else {
      const updatedShowData = moviesData;

      if (req.body.title) {
        updatedShowData.title = req.body.title;
      }
      if (req.body.datetime) {
        updatedShowData.datetime = req.body.datetime;
      }

      const value = await updateShowValidation.validateAsync(req.body);
      console.log(value);
      if (value) {
        await Show.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: updatedShowData,
          },
          { New: true }
        );
        successResponse(updatedShowData, res);
      }
    }
  } catch (err) {
    errorResponse(err, res, 500);
  }
};

const deleteShow = async (req, res) => {
  console.log(req.params.id);
  try {
    // await Movie.findById(req.body.userEmail);
    const resultedData = await Show.deleteOne({ _id: req.params.id });
    successResponse(resultedData, res);
  } catch (err) {
    errorResponse("id does not exist", res, 500);
  }
};

module.exports = {
  getShow,
  addShow,
  updateShow,
  deleteShow,
};
