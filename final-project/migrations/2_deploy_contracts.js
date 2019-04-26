// Steps for dev:
// 1. Deploy Factory contract
// 2. Deploy CostAverageOrderBook w/factory address
// 3. Deploy fake ERC20 contract
// 4. Deploy Exchange contract w/ fake ERC20 contract

const CostAverageOrderBook = artifacts.require("./CostAverageOrderBook");

module.exports = (deployer, network) => {
    const uniswapFactoryAddresses = {
        "mainnet": "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
        "rinkeby": "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36"
    }

    if (!(network in uniswapFactoryAddresses)) {
        const SeanToken = artifacts.require("./SeanToken");
        // const SeanTokenUniswapExchange = artifacts.require("./uniswap_exchange");
        const UniswapFactory = artifacts.require("./uniswap_factory");

        deployer.deploy(UniswapFactory)
            .then(() => deployer.deploy(CostAverageOrderBook, UniswapFactory.address)
                .then(() => deployer.deploy(SeanToken)
                    // .then(() => UniswapFactory.deployed()
                    //     .then((factory) => factory.createExchange(SeanToken.address))
                    // )
                )
            )
    }

    else {
        deployer.deploy(CostAverageOrderBook, uniswapFactoryAddresses[network]);
    }
};
