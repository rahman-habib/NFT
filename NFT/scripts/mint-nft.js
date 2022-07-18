require("dotenv").config();
const API_URL=process.env.API_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
const PUBLIC_KEY=process.env.PUBLIC_KEY;
const {CreateAlchemyWeb3, createAlchemyWeb3}=require('@alch/alchemy-web3');
const web3=createAlchemyWeb3(API_URL);
const contract=require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const contractAddress="0x0ce4BC80e29512373BcFBA31CdB0e756332f1acB";
const nftcontract=new web3.eth.Contract(contract.abi,contractAddress);


async function mintNFT(tokenURI){
    const nonce=await web3.eth.getTransactionCount(PUBLIC_KEY,'latest');

    const tx={
        'from': PUBLIC_KEY,
        'to':contractAddress,
        'nonce':nonce,
        'gas':500000,
        'maxPriorityFeePerGas':2999999987,
        'data':nftcontract.methods.mintNFT(PUBLIC_KEY,tokenURI).encodeABI()

    };
    const signedTx=await web3.eth.accounts.signTransaction(tx,PRIVATE_KEY);
    const transactionReceipt=await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction Receipt :${JSON.stringify(transactionReceipt)}');

}
mintNFT("https://gateway.pinata.cloud/ipfs/QmWxxGP7v7q7mrTkrfE11P8y45XpFV34ec9WthoHG6tmiJ");