const commandLineUsage = require("command-line-usage");
const sections = [
  {
    header: "The Crypto Farm Toolkit",
    content: "A toolkit for interacting with smart contracts",
  },
  {
    header: "Options",
    optionList: [
      {
        name: "env",
        typeLabel: "{underline file}",
        description: "JSON file to use [defaults to env.json]",
      },
      {
        name: "token",
        typeLabel: "{underline string}",
        description: "Token contract address to interact with",
      },
      {
        name: "router",
        typeLabel: "{underline string}",
        description: "Router contract to interact with [defaults to PCSv2]",
      },
      {
        name: "gasLimit",
        typeLabel: "{underline integer}",
        description: "Gas limit to use [defaults to 345684]",
      },
      {
        name: "gasPrice",
        typeLabel: "{underline integer}",
        description: "Gas Price to use [defaults to 10]",
      },
      {
        name: "deadline",
        typeLabel: "{underline integer}",
        description:
          "Seconds to allow transaction to process before revert [defaults to 120]",
      },
      {
        name: "slippage",
        typeLabel: "{underline integer}",
        description: "Slippage to use (percentage) [defaults to 1]",
      },
      {
        name: "purchaseAmount",
        typeLabel: "{underline float}",
        description: "Amount of [token] to buy in BNB",
      },
      {
        name: "sellAmount",
        typeLabel: "{underline float}",
        description: "Amount of [token] to sell for BNB",
      },
      {
        name: "sellDelay",
        typeLabel: "{underline integer}",
        description: "Delay (in ms) to add before selling (EXPERT)",
      },
      {
        name: "sellPercent",
        typeLabel: "{underline integer}",
        description: "Percentage of [token] to sell (EXPERT)",
      },
    ],
  },
  {
    header: "Command List",
    content: [
      {
        name: "approve",
        summary: "Approve your Tokens for sale on [router]",
      },
      {
        name: "buy",
        summary: "Buy tokens using [router]",
      },
      {
        name: "sell",
        summary: "Sell tokens using [router]",
      },
      {
        name: "txpool",
        summary: "SOON: EXPERT: Snipe direct liquidity events using [router]",
      },
      {
        name: "dxsale",
        summary: "SOON: ELITE: Snipe dxSale finalizations",
      },
    ],
  },
];
const displayGuide = () => {
  console.log(commandLineUsage(sections));
  process.exit();
};

module.exports = displayGuide;
