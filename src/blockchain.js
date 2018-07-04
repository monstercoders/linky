const CryptoJS = require("crypto-js"),
    Provider = require("./provider"),
    Consumer = require("./consumer");

const { initProvider, getPublicFromProvider, getPrivateFromProvider } = Provider;
const { initConsumer, getPublicFromConsumer, getPrivateFromConsumer } = Consumer;

class Block {
    constructor(index, hash, previousHash, timestamp, address, key, dataType, data){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.address = address;
        this.key = key;
        this.dataType = dataType;
        this.data = data;
    }
}

class VehicleData {
    constructor(video, generalData) {
        this.video = video;
        this.generalData = generalData;
    }
}

const genesisData = new VehicleData(
    "",
    ""
);

const genesisBlock = new Block(
    0,
    "4D8FE06390AD47CAF80C04CFDF25161F01EDDD924C3F1CC4851888E662F3E6C1",
    "",
    1530616752,
    "",
    "",
    "vehicle",
    genesisData
);

let blockchain = [genesisBlock];

var ecr = function(obj, key) {
    return CryptoJS.AES.encrypt(JSON.stringify(obj), key).toString();
};
 
var dcr = function(obj, key) {
    return JSON.parse(CryptoJS.AES.decrypt(obj, key).toString(CryptoJS.enc.Utf8));
};

const getNewestBlock = () => blockchain[blockchain.length - 1];
const getBlockchain = () => blockchain;
const getTimestamp = () => Math.round(new Date().getTime() / 1000);
const createHash = (index, previousHash, timestamp, address, key, dataType, data) =>
    CryptoJS.SHA256(
        index + previousHash + timestamp + address + key + dataType + JSON.stringify(data)
    ).toString();
const createNewBlock = (video, generalData) => {
    const previousBlock = getNewestBlock();
    const newBlockIndex = previousBlock.index + 1;
    const previousBlockHash = previousBlock.hash;
    const newTimestamp = getTimestamp();
    const blockData = new VehicleData(video, generalData);
    const randomKey = Math.random().toString(35).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const encryptKey = ecr(randomKey, getPrivateFromProvider());
    //const decryptKey = dcr(encryptKey, getPrivateFromProvider());

    //console.log("###");
    //console.log(randomKey);
    //console.log("###");
    //console.log(encryptKey);
    //console.log("###");
    //console.log(decryptKey);

    const hash = createHash(
        newBlockIndex,
        previousBlockHash,
        newTimestamp,
        getPublicFromProvider(),
        encryptKey,
        "vehicle",
        blockData
    );

    const newBlock = new Block(
        newBlockIndex,
        hash,
        previousBlockHash,
        newTimestamp,
        getPublicFromProvider(),
        encryptKey,
        "vehicle",
        blockData
    )

    addBlockToChain(newBlock);
    return newBlock;
};

const addBlockToChain = candidateBlock => {
    blockchain.push(candidateBlock);
    return true;
};

console.log(blockchain);

module.exports = {
    getBlockchain,
    createNewBlock
}