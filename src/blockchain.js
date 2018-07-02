const CryptoJS = require("crypto-js"),
    Provider = require("./provider"),
    Consumer = require("./consumer");

const { initProvider, getPublicFromProvider } = Provider;
const { initConsumer, getPublicFromConsumer } = Consumer;

class Block {
    constructor(index, hash, previousHash, timestamp, address, dataType, dataSerial, data, key){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.address = address;
        this.dataType = dataType;
        this.dataSerial = dataSerial;
        this.key = key;
        this.data = data;
    }
}

class VehicleData {
    constructor(video, generalData) {
        this.video = generalData;
        this.generalData = generalData;
    }
}

const genesisData = new VehicleData(
    "",
    ""
);

const genesisBlock = new Block(
    0,
    "82a3ecd4e76576fccce9999d560a31c7ad1faff4a3f4c6e7507a227781a8537f",
    "",
    1518512316,
    0,
    0
  );

let blockchain = [genesisBlock];

const getNewestBlock = () => blockchain[blockchain.length - 1];
const getBlockchain = () => blockchain;
const getTimestamp = () => Math.round(new Date().getTime() / 1000);

const createNewBlock = data => {
    const previousBlock = getNewestBlock();
    const newBlockIndex = previousBlock.index + 1;
    const newTimestamp = getTimestamp();
    addBlockToChain(newBlock);
    require("./p2p").broadcastNewBlock();
    return newBlock;
};

const addBlockToChain = candidateBlock => {
    blockchain.push(candidateBlock);
    return true;
};

console.log(blockchain);

module.exports = {
    getBlockchain,
    createNewBlock,
    addBlockToChain
}