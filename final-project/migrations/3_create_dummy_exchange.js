const UniswapFactory = artifacts.require("./uniswap_factory");
const UniswapFactoryInterface = artifacts.require("./UniswapFactoryInterface");
const SeanToken = artifacts.require("./SeanToken");

module.exports = (deployer, network, accounts) => {
    const uniswapFactoryAddresses = {
        "mainnet": "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
        "rinkeby": "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36"
    }

    if (!(network in uniswapFactoryAddresses)) {
        let token;
        let factory;

        deployer
            .then(() => SeanToken.deployed())
            .then((instance) => token = instance)
            .then(() => UniswapFactory.deployed())
            .then((instance) => factory = instance)
            .then(() => factory.createExchange(token.address, {from: accounts[1]})
        );

        // // Next steps:
        // // 1. Add liquidity with ETH and SeanToken
        // const min_liquidity = 0;
        // const max_tokens = 10000;
        // const deadline = now + 300 // in JS
        // exchange.addLiquidity(min_liquidity, max_tokens, deadline, {value: 5000000000000000000})
    }
};
