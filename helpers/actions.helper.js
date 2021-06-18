"use strict";
const ethers = require("ethers");

//mainnet
const wbnb = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
//testnet
//const wbnb = "0xae13d989dac2f0debff460ac112a837c89baa7cd";

class ActionHelper {
  constructor() {
    this.provider = new ethers.providers.WebSocketProvider(
      process.env.BSC_NODE_WSS
    );
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    this.account = this.wallet.connect(this.provider);
  }

  approve(action) {
    return new Promise(async (resolve, reject) => {
      const contract = new ethers.Contract(
        action.token,
        [
          "function allowance(address owner, address spender) external view returns (uint)",
          "function approve(address _spender, uint256 _value) public returns (bool success)",
          "function name() external pure returns (string memory)",
        ],
        this.account
      );
      const tokenName = await contract.name();
      const allowance = await contract.allowance(
        process.env.RECIPIENT,
        action.router
      );
      if (allowance._hex === "0x00") {
        const tx = await contract.approve(
          action.router,
          ethers.constants.MaxUint256
        );
        const receipt = await tx.wait();
        console.log("Approved " + tokenName + " for sale");
        console.log("Your txHash: " + receipt.transactionHash);
      } else {
        console.log(tokenName + " already approved for sale");
      }
      resolve();
    });
  }

  buy(action) {
    return new Promise(async (resolve) => {
      console.log(action);
      const router = new ethers.Contract(
        action.router,
        [
          "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
          "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
        ],
        this.account
      );
      const purchaseAmount = ethers.utils.parseUnits(
        action.purchaseAmount,
        "ether"
      ); // buy in BNB
      const amountOutMin = 0;
      const tx = await router.swapExactETHForTokens(
        amountOutMin,
        [wbnb, action.token],
        process.env.RECIPIENT,
        Date.now() + 1000 * action.deadline,
        {
          value: purchaseAmount,
          gasLimit: action.gasLimit,
          gasPrice: ethers.utils.parseUnits(action.gasPrice, "gwei"),
        }
      );
      console.log("Waiting for Reciept...");
      const receipt = await tx.wait();
      console.log("Your txHash: " + receipt.transactionHash);
      resolve();
    });
  }

  sell(action) {
    return new Promise(async (resolve) => {
      await this.approve(action);
      const contract = new ethers.Contract(
        action.token,
        [
          "function balanceOf(address account) external view returns (uint256)",
          "function decimals() view returns (uint8)",
        ],
        this.account
      );
      const router = new ethers.Contract(
        action.router,
        [
          "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
          "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
        ],
        this.account
      );
      const balance = await contract.balanceOf(process.env.RECIPIENT);
      const decimals = await contract.decimals();

      const sellAmount = ethers.utils.parseUnits(balance, decimals);
      const amounts = await router.getAmountsOut(sellAmount, [
        action.token,
        wbnb,
      ]);
      const amountOutMin = amounts[1].sub(amounts[1].div(slippage));
      const tx = await router.swapExactTokensForETH(
        sellAmount,
        amountOutMin,
        [action.token, wbnb],
        process.env.RECIPIENT,
        Date.now() + 1000 * action.deadline,
        {
          gasLimit: process.env.gasLimit,
          gasPrice: ethers.utils.parseUnits(process.env.gasPrice, "gwei"),
        }
      );
      console.log("Waiting for Reciept...");
      const receipt = await tx.wait();
      console.log("Your txHash: " + receipt.transactionHash);
      resolve();
    });
  }
}

module.exports = new ActionHelper();
