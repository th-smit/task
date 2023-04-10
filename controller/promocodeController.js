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
        const promoCodeData = await Promocode.find({
          _id: req.query.id,
          expiry_date: { $gt: new Date() },
        });
        successResponse(promoCodeData, res);
      } else {
        const promoCodeData = await Promocode.find({
          expiry_date: { $gt: new Date() },
        });
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
    console.log("hello");
    console.log("before  ", req.body.expiry_date);

    let expiryTime = new Date(req.body.expiry_date);
    expiryTime.setDate(expiryTime.getDate() + 1);
    expiryTime.setUTCHours(0, 0, 0, 0);
    console.log("+1 ", expiryTime);

    const value = await addPromocodeValidation.validateAsync(req.body);
    console.log(value);
    if (value) {
      console.log("fetched promocode data " + promocodeData.length);
      if (promocodeData.length === 0) {
        const dataObj = new Promocode({
          promo_name: req.body.promo_name,
          discount: req.body.discount,
          expiry_date: expiryTime,
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
    errorResponse(err, res, 501);
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

const deletePromoCode = async (req, res) => {
  try {
    await Promocode.deleteOne({ promo_name: req.params.promo_name });
    await UserPromoCode.deleteMany({ promo_name: req.params.promo_name });
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

const getUserNameHighestTimeUsedPC = async (req, res) => {
  try {
    const limit = UserPromoCode.aggregate([
      {
        $group: {
          _id: "$email",
          totalLimit: { $sum: "$limit" },
        },
      },
      {
        $sort: {
          totalLimit: -1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "email",
          as: "names",
        },
      },
      {
        $project: {
          totalLimit: 1,
          userName: "$names.name",
        },
      },
    ]).exec((err, result) => {
      if (err) {
        console.error(err);
      }
      successResponse(result, res);
      console.log(result);
    });

    // const maxlimit = await UserPromoCode.find();
    // successResponse(maxlimit, res);
  } catch (error) {
    errorResponse(error, res, 500);
  }
};
const getUserPromo = async (req, res) => {
  console.log("get user promo");
  try {
    const limit = UserPromoCode.aggregate([
      {
        $group: {
          _id: "$promo_name",
          totalLimit: { $sum: "$limit" },
        },
      },
      {
        $sort: {
          totalLimit: -1,
        },
      },
    ]).exec((err, result) => {
      if (err) {
        console.error(err);
      }
      successResponse(result, res);
      console.log(result);
    });

    // const maxlimit = await UserPromoCode.find();
    // successResponse(maxlimit, res);
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

const getSaving = async (req, res) => {
  try {
    UserPromoCode.aggregate([
      {
        $group: {
          _id: "$email",
          totalSaving: { $sum: "$saving" },
        },
      },
    ]).exec((err, result) => {
      if (err) {
        console.error(err);
      }
      successResponse(result, res);
      console.log("saving data " + JSON.stringify(result));
    });
    console.log("hello");
  } catch (error) {
    errorResponse(error, res, 501);
  }
};

const getMoviePromo = async (req, res) => {
  try {
    UserPromoCode.aggregate(
      [
        {
          $group: {
            _id: { movietitle: "$movie_title", promo_name: "$promo_name" },
            count: { $max: "$limit" },
            totalLimit: { $sum: "$limit" },

            promo_name: { $first: "$promo_name" },
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
        {
          $group: {
            _id: "$_id.movietitle",

            count: { $max: "$totalLimit" },
            maxCount: { $first: "$totalLimit" },
            docs: { $push: "$$ROOT" },
          },
        },
        {
          $unwind: "$docs",
        },
        {
          $match: {
            $expr: {
              $eq: ["$docs.totalLimit", "$maxCount"],
            },
          },
        },
        {
          $sort: {
            maxCount: -1,
          },
        },

        {
          $project: {
            movie_title: "$_id",
            promoname: "$docs.promo_name",
            limit: "$maxCount",
          },
        },
      ],
      function (err, result) {
        if (err) {
          errorResponse(err, res, 501);
        } else {
          console.log("result is is" + JSON.stringify(result));
          successResponse(result, res);
        }
      }
    );
  } catch (error) {
    errorResponse(error, res, 501);
  }
};

module.exports = {
  addPromoCode,
  getPromoCode,
  editPromoCode,
  deletePromoCode,
  getUserPromo,
  getUserNameHighestTimeUsedPC,
  getMoviePromo,
  getSaving,
};
