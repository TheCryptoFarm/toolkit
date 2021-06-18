"use strict";
const env = require("./env.json");
Object.assign(process.env, env);

const AppController = require("./controllers/app.controller.js");
AppController.run()
  .then(() => {
    shutdown();
  })
  .catch((err) => {
    console.log("Error: " + err);
    shutdown();
  });

function shutdown() {
  AppController.shutdown().then(() => {
    process.exit();
  });
}

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(err);
  shutdown();
});

// Catch uncaught rejections
process.on("unhandledRejection", (err) => {
  console.error(err);
  shutdown();
});
