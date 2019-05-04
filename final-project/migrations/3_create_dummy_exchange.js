const UniswapFactory = artifacts.require("./uniswap_factory");
const UniswapExchange = artifacts.require("./uniswap_exchange");
const UniswapExchangeInterface = artifacts.require("./UniswapExchangeInterface");
const SeanToken = artifacts.require("./SeanToken");
const MoonToken = artifacts.require("./MoonToken");
const ConsensysToken = artifacts.require("./ConsensysToken");

module.exports = (deployer, network, accounts) => {
    const uniswapFactoryAddresses = {
        "mainnet": "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
        "rinkeby": "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36"
    }

    if (!(network in uniswapFactoryAddresses)) {
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
            .then(instance => createExchangeWithLiquidity(
                factory, instance, 5000000000000000000, 10000))
            .then(() => MoonToken.deployed())
            .then(instance => createExchangeWithLiquidity(
                factory, instance, 10000000000000000000, 300000))
            .then(() => ConsensysToken.deployed())
            .then(instance => createExchangeWithLiquidity(
                factory, instance, 3000000000000000000, 500000))
            .catch(err => console.log(err));
    }
};

const createExchangeWithLiquidity = (factory, token, amountEth, amountTokens) => {
    return factory.createExchange(token.address)
        .then(() => factory.getExchange(token.address))
        .then(exchangeAddress => {
            token.approve(exchangeAddress, amountTokens);
            return exchangeAddress;
        })
        .then(exchangeAddress => UniswapExchangeInterface.at(exchangeAddress))
        .then(exchange => {
            const min_liquidity = 0;
            const max_tokens = 10000;
            const deadline = Math.floor(Date.now() / 1000) + 300;
            exchange.addLiquidity(min_liquidity, max_tokens, deadline, {value: amountEth});
        })
}
