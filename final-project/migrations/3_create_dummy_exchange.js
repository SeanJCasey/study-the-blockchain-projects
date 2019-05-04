const UniswapFactory = artifacts.require("./uniswap_factory");
const UniswapExchange = artifacts.require("./uniswap_exchange");
const UniswapExchangeInterface = artifacts.require("./UniswapExchangeInterface");
const SeanToken = artifacts.require("./SeanToken");

module.exports = (deployer, network, accounts) => {
    const uniswapFactoryAddresses = {
        "mainnet": "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
        "rinkeby": "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36"
    }

    if (!(network in uniswapFactoryAddresses)) {
        let token;
        let factory;
        let exchangeTemplate;

        deployer
            .then(() => UniswapExchange.deployed())
            .then((instance) => {
                exchangeTemplate = instance;
            })
            .then(() => UniswapFactory.deployed())
            .then((instance) => {
                factory = instance;
                factory.initializeFactory(exchangeTemplate.address)
            })
            .then(() => SeanToken.deployed())
            .then((instance) => token = instance)
            .then(() => factory.createExchange(token.address))
            // Add liquidity with ETH and SeanToken
            .then(() => factory.getExchange(token.address))
            .then(exchangeAddress => {
                token.approve(exchangeAddress, 10000);
                return exchangeAddress;
            })
            .then(exchangeAddress => UniswapExchangeInterface.at(exchangeAddress))
            .then(exchange => {
                const min_liquidity = 0;
                const max_tokens = 10000;
                const deadline = Math.floor(Date.now() / 1000) + 300;

                console.log("deadline", deadline);
                // console.log(Date.now());
                exchange.addLiquidity(min_liquidity, max_tokens, deadline, {value: 5000000000000000000})
                    // .then(result => console.log(result))
                    .catch(err => console.log(err));
            })
    }
};
