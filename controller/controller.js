const model = require("../models/model");
const {
  AddMovieValidation,
  UpdateMovieValidation,
} = require("../middleware/validationmiddleware");

const getmovies = async (req, res) => {
  let smethod = "-";
  if (Number(req.query.sort) === 1) {
    smethod = "";
  }

  try {
    if (!req.query.sortedby) {
      req.query.sortedby = "updatedAt";
    } else {
      if (req.query.sortedby != "createdAt") {
        res.status(200).json("need to pass proper query string");
      }
    }
    console.log(" " + smethod + req.query.sortedby);
    const data = await model.find().sort("" + smethod + req.query.sortedby);

    res.json(data);
  } catch (error) {
    res.send("error " + error);
  }
};

const addmovies = async (req, res) => {
  try {
    AddMovieValidation.validate(req.body);
  } catch (error) {
    res.send("error " + error);
  }

  const { title, description, is_released } = req.body;
  const data = new model({
    title: title,
    description: description,
    is_released: is_released,
  });

  try {
    const d1 = await data.save();
    res.json(d1);
  } catch (error) {
    res.send("error " + error);
  }
};

const findmovies = async (req, res) => {
  try {
    const data = await model.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.send("error " + error);
  }
};

const updatemovies = async (req, res) => {
  try {
    let data1 = await model.findById(req.params.id);

    if (!data1) {
      return res.json({ message: "id does not exist", success: false });
    } else {
      const update = data1;

      if (req.body.title) {
        update.title = req.body.title;
      }
      if (req.body.description) {
        update.description = req.body.description;
      }
      if (req.body.is_released) {
        update.is_released = req.body.is_released;
      }

      const status = UpdateMovieValidation.validate(update);

      if (status) {
        console.log("changes made");
        await model.findByIdAndUpdate(req.params.id, { $set: update });
        res.json(update);
      } else {
        console.log("changes not made");
      }
    }
  } catch (error) {
    res.json("error " + error);
  }
};

const deletemovies = async (req, res) => {
  try {
    let data1 = await model.findById(req.params.id);

    if (!data1) {
      return res.json({ message: "id does not exist", success: false });
    }
    model
      .deleteOne({ _id: req.params.id })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.send("error " + error);
  }
};

module.exports = {
  getmovies,
  findmovies,
  addmovies,
  updatemovies,
  deletemovies,
};
