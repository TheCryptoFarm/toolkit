"use strict";
const ethers = require("ethers");

class ActionHelper {
  constructor() {
    this.provider = new ethers.providers.WebSocketProvider(
      process.env.BSC_NODE_WSS
    );
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    this.account = this.wallet.connect(this.provider);
    this.erc20ABI = [
      "function allowance(address owner, address spender) external view returns (uint)",
      "function approve(address _spender, uint256 _value) public returns (bool success)",
      "function name() external pure returns (string memory)",
      "function symbol() external view returns (string memory)",
      "function balanceOf(address account) external view returns (uint256)",
      "function decimals() view returns (uint8)",
    ];
    this.wbnbABI = [
      "function deposit() public payable",
      "function withdraw(uint wad) public",
    ];
    this.routerABI = [
      "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable",
      "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
    ];
    this.factoryABI = [
      "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    ];
  }

  approve(action) {
    return new Promise(async (resolve) => {
      const contract = new ethers.Contract(
        action.token,
        this.erc20ABI,
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
        console.log("Approved " + tokenName + " for sale");
        console.log("Your txHash: " + tx.hash);
        resolve(tx.hash);
      } else {
        console.log(tokenName + " already approved for sale");
        resolve(1);
      }
    });
  }

  buy(action) {
    return new Promise(async (resolve) => {
      const router = new ethers.Contract(
        action.router,
        this.routerABI,
        this.account
      );
      const purchaseAmount = ethers.utils.parseUnits(
        action.purchaseAmount,
        "ether"
      ); // buy in BNB
      const amounts = await router.getAmountsOut(purchaseAmount, [
        action.wbnb,
        action.token,
      ]);
      const amountOutMin = amounts[1].sub(amounts[1].div(action.slippage));
      const tx = await router.swapExactETHForTokens(
        amountOutMin,
        [action.wbnb, action.token],
        process.env.RECIPIENT,
        Date.now() + 1000 * action.deadline,
        {
          value: purchaseAmount,
          gasLimit: action.gasLimit,
          gasPrice: ethers.utils.parseUnits(action.gasPrice, "gwei"),
        }
      );
      console.log("Your Buy txHash: " + tx.hash);
      resolve(tx.hash);
    });
  }

  balance() {
    return new Promise(async (resolve) => {
      const balance = await this.provider.getBalance(process.env.RECIPIENT);
      console.log("Balance: " + ethers.utils.formatEther(balance) + " BNB");
      resolve(balance);
    });
  }

  deposit(action) {
    return new Promise(async (resolve) => {
      const wbnb = new ethers.Contract(action.wbnb, this.wbnbABI, this.account);
      const tx = await wbnb.deposit({
        value: action.depositAmount,
        gasLimit: action.gasLimit,
        gasPrice: ethers.utils.parseUnits(action.gasPrice, "gwei"),
      });
      console.log("Your Deposit txHash: " + tx.hash);
      resolve(tx.hash);
    });
  }

  getPair(action) {
    return new Promise(async (resolve) => {
      const factory = new ethers.Contract(
        action.factory,
        this.factoryABI,
        this.account
      );
      const pairAddress = await factory.getPair(action.wbnb, action.token);
      console.log("pairAddress: " + pairAddress);
      resolve(pairAddress);
    });
  }

  getReserves(action) {
    return new Promise(async (resolve) => {
      const factory = new ethers.Contract(
        action.factory,
        this.factoryABI,
        this.account
      );
      const pairAddress = await factory.getPair(action.wbnb, action.token);
      const pairContract = new ethers.Contract(
        pairAddress,
        [
          "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        ],
        this.account
      );
      const reserves = await pairContract.getReserves();
      console.log("Reserves: " + reserves);
      resolve(reserves);
    });
  }

  tokenBalance(action) {
    return new Promise(async (resolve) => {
      const contract = new ethers.Contract(
        action.token,
        this.erc20ABI,
        this.account
      );
      const name = await contract.name();
      const symbol = await contract.symbol();
      const balance = await contract.balanceOf(process.env.RECIPIENT);
      const decimals = await contract.decimals();
      console.log("Token " + name);
      console.log(
        "Balance: " + ethers.utils.formatUnits(balance, decimals) + " " + symbol
      );
      resolve({
        name: name,
        balance: balance,
        decimals: decimals,
        symbol: symbol,
      });
    });
  }

  sell(action) {
    return new Promise(async (resolve) => {
      await this.approve(action);
      const contract = new ethers.Contract(
        action.token,
        this.erc20ABI,
        this.account
      );
      const router = new ethers.Contract(
        action.router,
        this.routerABI,
        this.account
      );
      const decimals = await contract.decimals();
      const sellAmount = ethers.utils.parseUnits(
        action.sellAmount,
        decimals.toString()
      );
      const amounts = await router.getAmountsOut(sellAmount, [
        action.token,
        action.wbnb,
      ]);
      const amountOutMin = amounts[1].sub(amounts[1].div(action.slippage));
      const tx =
        await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
          sellAmount,
          amountOutMin,
          [action.token, action.wbnb],
          process.env.RECIPIENT,
          Date.now() + 1000 * action.deadline,
          {
            gasLimit: action.gasLimit,
            gasPrice: ethers.utils.parseUnits(action.gasPrice, "gwei"),
          }
        );
      console.log("Your Sell txHash: " + tx.hash);
      resolve(tx.hash);
    });
  }

  withdraw(action) {
    return new Promise(async (resolve) => {
      const wbnb = new ethers.Contract(action.wbnb, this.wbnbABI, this.account);
      const tx = await wbnb.withdraw(account.withdrawAmount, {
        gasLimit: action.gasLimit,
        gasPrice: ethers.utils.parseUnits(action.gasPrice, "gwei"),
      });
      console.log("Your Withdraw txHash: " + tx.hash);
      resolve(tx.hash);
    });
  }
}

module.exports = new ActionHelper();
