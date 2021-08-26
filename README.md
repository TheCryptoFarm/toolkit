#The Crypto Farm Toolkit

#A toolkit for interacting with smart contracts

#Usage: node app COMMAND [OPTIONS]

#Options

 --env file JSON file to use [defaults to env.json]  
 --token string Token contract address to interact with  
 --wbnb string WBNB Token contract to interact with [defaults to mainnet contract]  
 --router string Router contract to interact with [defaults to PCSv2]  
 --factory string Factory contract to interact with [defaults to PCS]  
 --gasLimit integer Gas limit to use [defaults to 2000000]  
 --gasPrice integer Gas Price to use [defaults to 7]  
 --deadline integer Seconds to allow transaction to process before revert [defaults to 120]
 --slippage integer Slippage to use (percentage) [defaults to 1]  
 --depositAmount float Amount of BNB to Wrap  
 --withdrawAmount float Amount of BNB to Unrwap  
 --purchaseAmount float Amount of [token] to buy in BNB  
 --sellAmount float Amount of [token] to sell for BNB  
 --sellDelay integer SOON: Delay (in ms) to add before selling (EXPERT)  
 --sellPercent integer SOON: Percentage of [token] to sell (EXPERT)

#Command List

 approve Approve your Tokens for sale on [router]  
 buy Buy tokens using [router]  
 sell Sell tokens using [router]  
 balance Balance of BNB in wallet  
 tokenBalance Balance of [token] in wallet  
 deposit Wrap BNB  
 withdraw UnWrap BNB  
 getPair Get Pancake Pair contract from [token]  
 getReserves Get Reserves for [token]  
 txpool SOON: EXPERT: Snipe direct liquidity events using [router]
 dxsale SOON: ELITE: Snipe dxSale finalizations
