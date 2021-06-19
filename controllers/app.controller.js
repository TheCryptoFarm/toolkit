"use strict";
const commandLineArgs = require("command-line-args");
const displayGuide = require("../helpers/guide.helper.js");
const actions = require("../helpers/actions.helper.js");

class AppController {
  async run() {
    const task = commandLineArgs([{ name: "command", defaultOption: true }], {
      stopAtFirstUnknown: true,
    });
    const argv = task._unknown || [];
    if (!task.command) {
      displayGuide();
    }
    const optionsDefs = [
      {
        name: "env",
        defaultOption: "env.json",
      },
      { name: "token" },
      {
        name: "router",
        defaultValue: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      },
      {
        name: "factory",
        defaultValue: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      },
      {
        name: "gasLimit",
        defaultValue: "500000",
      },
      { name: "gasPrice", defaultValue: "10" },
      { name: "slippage", defaultValue: "1" },
      { name: "deadline", defaultValue: "120" },
      {
        name: "purchaseAmount",
      },
      {
        name: "sellAmount",
      },
      { name: "sellDelay" },
      {
        name: "sellPercentage",
      },
    ];
    const options = commandLineArgs(optionsDefs, {
      argv,
      stopAtFirstUnknown: true,
    });
    const action = {
      task: task.command,
      options: options,
    };

    try {
      await actions[action.task](action.options);
    } catch {
      throw "Unknown action\n\n";
    }
  }

  shutdown() {
    return new Promise((resolve) => {
      resolve();
    });
  }
}

module.exports = new AppController();
