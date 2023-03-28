const Promocode = require("../models/promocodeModel");
const UserPromoCode = require("../models/userPromoModel");

const { successResponse, errorResponse } = require("../utils/Response");
const {
  addPromocodeValidation,
} = require("../middleware/validationMiddleware");

const getPromoCode = async (req, res) => {
  try {
    console.log("from the req " + req.params.email);
    const promocodeData = await Promocode.find();
    successResponse(promocodeData, res);
  } catch (error) {
    errorResponse(error, res, 500);
  }

  // console.log("user promo data " + userPromoData);
  // console.log("type of userpromodata " + typeof userPromoData);

  // const PromoData = await Promocode.find()

  // PromoData.map(getpromo)

  // function getpromo(data)
  // {
  //   if(data.promo_name == )
  // }

  // try {
  //   // if (!req.params.id) {
  //   //   console.log("inside");
  //   //   promocodeData = await Promocode.find();
  //   // } else {
  //   //   //console.log(req.query.id);
  //   //   promocodeData = await Promocode.find({ _id: req.params.id });
  //   // }
  //   const promocodeData = await Promocode.find();
  //   console.log("promo data " + promocodeData);
  //   successResponse(promocodeData, res);
  // } catch (err) {
  //   errorResponse(err, res, 404);
  // }
};

const getUserPromo = async (req, res) => {
  console.log("req. params is " + req.params.email);
  try {
    const userPromoData = await UserPromoCode.find({ email: req.params.email });
    console.log(userPromoData);
    successResponse(userPromoData, res);
  } catch (error) {
    errorResponse(error, res, 404);
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
  // try {
  //   if (!req.params.id) {
  //     console.log("inside");
  //     promocodeData = await Promocode.find();
  //   } else {
  //     //console.log(req.query.id);
  //     promocodeData = await Promocode.find({ _id: req.params.id });
  //   }
  //   // promocodeData = await Promocode.find();
  //   console.log("promo data " + promocodeData);
  //   successResponse(promocodeData, res);
  // } catch (err) {
  //   errorResponse(err, res, 404);
  // }
};

module.exports = {
  addPromoCode,
  getPromoCode,
  editPromoCode,
  getUserPromo,
};
