# How to Create an NFT
---

## Create a Node Project
Let's create an empty node project. Navigate to your command line and type:
`mkdir my-nft && cd my-nft`
`npm init -y`
## Create a Hardhat Project
Hardhat is a development environment to compile, deploy, test, and debug smart contracts. It helps developers create dApps locally before deploying them to a live chain.
In your terminal, run the following commands:

`npm install --save-dev hardhat`
`npx hardhat`
`Create a sample project`

Agree to all the defaults (project root, adding a .gitignore, and installing all sample project dependencies).
To check if everything works properly, run:

`npx hardhat test`

We now have our hardhat development environment successfully configured. Let us now install the OpenZeppelin contracts package. This will give us access to ERC721 implementations (the standard for NFTs) on top of which we will build our contract.

`npm install @openzeppelin/contracts`
## Write the smart contract

Open the project in your favorite editor (e.g. VSCode). We will use a language called Solidity to write our contract.
Navigate to the contracts folder and create a new file called MyNFT.sol. Add the following code to the file.

``` js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
```
### Connect Metamask & Alchemy to your project
Now that we've created a Metamask wallet, an Alchemy account, and a smart contract, it’s time to connect the three.
Every transaction sent from your virtual wallet requires a signature using your unique private key. To provide our program with this permission, we can safely store our private key (and Alchemy API key) in an environment file.
Install the dotenv package in your project directory by running:

`npm install dotenv --save`

Then, create a .env file in the root directory of our project, and add your Metamask private key and HTTP Alchemy API Key (from Step 1) to it.

**Note**:Your `.env` file must be named `.env` ! Do not change the name to xx.env

Your `.env` should look like this:

`API_URL = "https://eth-ropsten.alchemyapi.io/v2/your-api-key"`
`PRIVATE_KEY = "your-metamask-private-key"`

###  Update hardhat.config.js

We’ve added several dependencies and plugins so far, now we need to update `hardhat.config.js` so that our project knows about all of them.
Replace the contents of `hardhat.config.js` with the following:
``` js
/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
   solidity: "0.8.4",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
}
```
### Write the deployment script
Now that our contract is written and our configuration file is good to go, it’s time to write the contract deploy script.
Navigate to the `scripts/` folder and create a new file called `deploy.js` , and add the following:

``` js
async function main() {
   // Grab the contract factory 
   const MyNFT = await ethers.getContractFactory("MyNFT");

   // Start deployment, returning a promise that resolves to a contract object
   const myNFT = await MyNFT.deploy(); // Instance of the contract 
   console.log("Contract deployed to address:", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
  ```
  ###  Deploy the contract

  We’re finally ready to deploy our smart contract! Navigate back to the root of your project directory, and in the command line run:

  `npx hardhat run scripts/deploy.js --network goerli`