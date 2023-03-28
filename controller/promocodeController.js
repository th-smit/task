/* eslint-disable array-callback-return */

const Promocode = require("../models/promocodeModel");
const UserPromoCode = require("../models/userPromoModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addPromocodeValidation,
} = require("../middleware/validationMiddleware");

const getPromoCode = async (req, res) => {
  let promoArray = [];
  try {
    if (req.params.email) {
      const promocodeData = await Promocode.find({
        movies: { $in: [req.params.movie_title] },
      });

      const userPromocodeData = await UserPromoCode.find({
        email: req.params.email,
      });

      const userPromocodes = userPromocodeData.map((data) => data.promo_name);

      // eslint-disable-next-line consistent-return
      promocodeData.map((data) => {
        if (userPromocodes.includes(data.promo_name)) {
          // eslint-disable-next-line consistent-return, array-callback-return
          return userPromocodeData.map((data1) => {
            if (data1.promo_name === data.promo_name) {
              if (data.limit > data1.limit) {
                if (data.active_status && data.expiry_date > new Date()) {
                  promoArray.push(data);
                  return data;
                }
              }
            }
          });
        }
        if (data.active_status && data.expiry_date > new Date()) {
          promoArray.push(data);
          return data;
        }
      });
      successResponse(promoArray, res);
    } else {
      if (req.query.id) {
        const promoCodeData = await Promocode.find({ _id: req.query.id });
        successResponse(promoCodeData, res);
      } else {
        const promoCodeData = await Promocode.find();
        successResponse(promoCodeData, res);
      }
    }
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

const addPromoCode = async (req, res) => {
  console.log("body data", req.body);
  try {
    const promocodeData = await Promocode.find({
      promo_name: req.body.promo_name,
    });
    console.log("promocode length ", promocodeData.length);

    const value = await addPromocodeValidation.validateAsync(req.body);
    console.log(value);
    if (value) {
      console.log("fetched promocode data " + promocodeData.length);
      if (promocodeData.length === 0) {
        const dataObj = new Promocode({
          promo_name: req.body.promo_name,
          discount: req.body.discount,
          expiry_date: req.body.expiry_date,
          limit: req.body.limit,
          promocode_type: req.body.promocode_type,
          active_status: req.body.active_status,
          movies: req.body.movies,
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

const editPromoCode = async (req, res) => {
  console.log("params " + req.params.id);
  console.log("body data " + JSON.stringify(req.body));
  try {
    const promoData = await Promocode.findOne({ _id: req.params.id });
    console.log("fetched data " + promoData);
    if (!promoData) {
      errorResponse("data does not exist", res, 404);
    } else {
      const updatedPromoData = promoData;
      if (req.body.promo_name) {
        updatedPromoData.promo_name = req.body.promo_name;
      }

      updatedPromoData.active_status = req.body.active_status;

      if (req.body.count) {
        updatedPromoData.limit = req.body.count;
      }
      if (req.body.promo_type) {
        updatedPromoData.promocode_type = req.body.promo_type;
      }
      if (req.body.movies) {
        updatedPromoData.movies = req.body.movies;
      }
      updatedPromoData.expiry_date = req.body.expiry_date;
      if (true) {
        await Promocode.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: updatedPromoData,
          },
          { New: true }
        );
        successResponse(updatedPromoData, res);
      }
    }
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

module.exports = {
  addPromoCode,
  getPromoCode,
  editPromoCode,
};
