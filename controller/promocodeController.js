const Movie = require("../models/movieModel");
const Promocode = require("../models/promocodeModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addPromocodeValidation,
} = require("../middleware/validationMiddleware");

const getPromoCode = async (req, res) => {
  let promocodeData = "";
  console.log("paramas" + req.params.id);
  try {
    if (!req.params.id) {
      console.log("inside");
      promocodeData = await Promocode.find();
    } else {
      //console.log(req.query.id);
      promocodeData = await Promocode.find({ _id: req.params.id });
    }
    // promocodeData = await Promocode.find();
    console.log("promo data " + promocodeData);
    successResponse(promocodeData, res);
  } catch (err) {
    errorResponse(err, res, 404);
  }
};

const addPromoCode = async (req, res) => {
  console.log(req.body);
  try {
    const value = await addPromocodeValidation.validateAsync(req.body);
    console.log(value);
    if (value) {
      const promocodeData = await Promocode.find({
        promo_name: req.body.promocode,
      });

      console.log("fetched promocode data " + promocodeData.length);
      if (promocodeData.length === 0) {
        const dataObj = new Promocode({
          promo_name: req.body.promo_name,
          expiry_date: req.body.expiry_date,
          limit: req.body.limit,
          promocode_type: req.body.promocode_type,
          active_status: req.body.active_status,
        });
        console.log("dataObj " + dataObj);
        const moviesData = await dataObj.save();
        successResponse(dataObj, res);
      } else {
        errorResponse("alreday same named promocode available", res, 500);
      }
    }
  } catch (err) {
    // errorResponse(err.details[0]?.message, res, 501);
    errorResponse("ERROR", res, 501);
  }
};

module.exports = {
  addPromoCode,
  getPromoCode,
};
