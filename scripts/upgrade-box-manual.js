const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { network, deployments, deployer, ethers } = require("hardhat")
const { verify } = require("../helper-functions")

async function main() {
    // Upgrade!
    // Not "the hardhat-deploy way"
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy")

    const proxyBoxV1 = await ethers.getContractAt("Box", transparentProxy.address)
    const versionV1 = await proxyBoxV1.version()
    console.log(versionV1.toString())

    const boxV2 = await ethers.getContract("BoxV2")
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    await upgradeTx.wait(1)

    const proxyBoxV2 = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const versionV2 = await proxyBoxV2.version()
    console.log(versionV2.toString())
    console.log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
