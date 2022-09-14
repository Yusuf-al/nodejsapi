const express = require("express");
const usersRoute = require("./router/allUserRoute");

const app = express();

app.use(express.json());

const port = 3050;

app.use("/", usersRoute);

const server = app.listen(port, () => {
  console.log(`Connection running at ${port}..`);
});
