const express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    Blockchain = require("./blockchain"),
    Provider = require("./provider"),
    Consumer = require("./consumer");

const { getBlockchain, createNewBlock } = Blockchain;
const { initProvider, getPublicFromProvider } = Provider;
const { initConsumer, getPublicFromConsumer } = Consumer;

const PORT = 1588;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));
app.get("/blocks", (req, res) => {
    res.send(getBlockchain());
});

app.post("/blocks", (req, res) => {
    const { body: { data } } = req;
    const newBlock = createNewBlock(data);
    res.send(newBlock);
});

app.get("/provider/address", (req, res) => {
    res.send(getPublicFromProvider());
});

app.get("/consumer/address", (req, res) => {
    res.send(getPublicFromConsumer());
});

app.listen(PORT, () => console.log(`LINKY server running on ${PORT}`));

// Add your code
initProvider();
initConsumer();