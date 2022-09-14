const { json } = require("express");
const express = require("express");
const fs = require("fs");

const usersRoute = express.Router();

usersRoute.route("/").get(async (req, res) => {
  const { limit } = req.query;
  fs.readFile("./data.json", "utf-8", (err, data) => {
    const userList = JSON.parse(data);
    const queryData = userList.slice(0, limit);
    if (!err) {
      res.status(200).json({
        allUserList: queryData,
      });
    } else {
      console.log(err);
    }
  });
});

usersRoute.route("/").post(async (req, res) => {
  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (!err) {
      const allData = JSON.parse(data);

      const lastItemId = parseInt(allData[allData.length - 1].id);

      const newData = {
        id: lastItemId + 1,
        name: req.body.name,
        gender: req.body.gender,
        contact: req.body.contact,
        photo_url: req.body.photo_url,
        address: req.body.address,
      };

      for (const key in newData) {
        if (newData[key] === " ") {
          return res.json("All Fields should be filled");
        }
      }

      const updateData = [...allData, newData];
      console.log(updateData);
      fs.writeFile("data.json", JSON.stringify(updateData), function (err) {
        if (err) throw err;
      });
      res.status(200).json({
        data: JSON.parse(data),
      });
    } else {
      console.log(err);
    }
  });
});

usersRoute.route("/:id").get(async (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (!err) {
      const userdata = JSON.parse(data);
      let foundUser = userdata.find((x) => x.id === id);

      if (foundUser === undefined) {
        return res.json("data not found");
      }

      res.status(200).json({
        singledata: foundUser,
      });
    } else {
      console.log(err);
    }
  });
});

usersRoute.route("/update/:id").patch(async (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (!err) {
      const userdata = JSON.parse(data);
      let foundUser = userdata.find((x) => x.id === id);

      if (foundUser === undefined) {
        return res.json("data not found");
      }

      const newUpdateData = userdata.filter((x) => x.id != id);

      const updateSingleData = {
        id: id,
        name: req.body.name,
        gender: req.body.gender,
        contact: req.body.contact,
        photo_url: req.body.photo_url,
        address: req.body.address,
      };

      for (const key in updateSingleData) {
        if (updateSingleData[key] === " ") {
          return res.json("All Fields should be filled");
        }
      }

      const singleUpdateData = [...newUpdateData, updateSingleData];

      const sortedData = singleUpdateData.sort((a, b) => {
        return a.id - b.id;
      });

      fs.writeFile("data.json", JSON.stringify(sortedData), function (err) {
        if (err) throw err;
      });

      res.status(200).json({
        newData: sortedData,
      });
    } else {
      console.log(err);
    }
  });
});

usersRoute.route("/:id").delete(async (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("./data.json", "utf-8", (err, data) => {
    if (!err) {
      const userdata = JSON.parse(data);

      let foundUser = userdata.find((x) => x.id === id);
      if (foundUser === undefined) {
        return res.json("data not found");
      }

      let newUserData = userdata.filter((x) => x.id != id);
      fs.writeFile("data.json", JSON.stringify(newUserData), function (err) {
        if (err) throw err;
      });

      res.status(200).json({
        singledata: newUserData,
      });
    } else {
      console.log(err);
    }
  });
});

module.exports = usersRoute;
