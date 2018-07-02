const elliptic = require("elliptic"),
    path = require("path"),
    fs = require("fs");

const ec = new elliptic.ec("secp256k1");

const consumerPrivateKeyLocation = path.join(__dirname, "consumerPrivateKey");

const generateConsumerPrivateKey = () => {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

const getPrivateFromConsumer = () => {
    const buffer = fs.readFileSync(consumerPrivateKeyLocation, "utf8");
    return buffer.toString();
};

const getPublicFromConsumer = () => {
    const privateKey = getPrivateFromConsumer();
    const key = ec.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex");
};

const initConsumer = () => {
    if (fs.existsSync(consumerPrivateKeyLocation)) {
        return;
    }
    const newPrivateKey = generateConsumerPrivateKey();

    fs.writeFileSync(consumerPrivateKeyLocation, newPrivateKey);
};

module.exports = {
    initConsumer,
    getPublicFromConsumer,
    getPrivateFromConsumer
};