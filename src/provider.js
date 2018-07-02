const elliptic = require("elliptic"),
    path = require("path"),
    fs = require("fs");

const ec = new elliptic.ec("secp256k1");

const providerPrivateKeyLocation = path.join(__dirname, "providerPrivateKey");

const generateProviderPrivateKey = () => {
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate();
    return privateKey.toString(16);
};

const getPrivateFromProvider = () => {
    const buffer = fs.readFileSync(providerPrivateKeyLocation, "utf8");
    return buffer.toString();
};

const getPublicFromProvider = () => {
    const privateKey = getPrivateFromProvider();
    const key = ec.keyFromPrivate(privateKey, "hex");
    return key.getPublic().encode("hex");
};

const initProvider = () => {
    if (fs.existsSync(providerPrivateKeyLocation)) {
        return;
    }
    const newPrivateKey = generateProviderPrivateKey();

    fs.writeFileSync(providerPrivateKeyLocation, newPrivateKey);
};

module.exports = {
    initProvider,
    getPublicFromProvider,
    getPrivateFromProvider
};