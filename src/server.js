const express = require("express"),
    cors = require("cors"),
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
app.use(cors());
app.use(morgan("combined"));
app.get("/blocks", (req, res) => { res.send(getBlockchain()); })
    .post("/blocks", (req, res) => {
        try {
            const { body: { video, generalData } } = req;
            if (video === undefined || generalData === undefined) {
                throw Error("Please specify video and data");
            } else {
                const newBlock = createNewBlock(video, generalData);
                res.send(newBlock);
            }
        } catch (e) {
            res.status(400).send(e.message);
        }
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