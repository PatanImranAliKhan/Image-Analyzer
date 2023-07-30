import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const express = require("express");
const multer = require("multer");
const cors = require("cors");
var fs = require('fs')

var sizeOf = require('image-size');
import * as tf from "@tensorflow/tfjs-node";
const coco_ssd = require("@tensorflow-models/coco-ssd");

import ColorThief from 'colorthief'
const colorThief = new ColorThief();

const Canvas = require("canvas");
const canvas = Canvas.createCanvas(200, 200)
const getPath = require("path")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const orgName = file.originalname.split(".");

        console.log("file: " + orgName);
        cb(null, orgName[0] + ".jpeg");
    }
});

const upload = multer({ storage: storage })

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:4200'
}));

/**
 * /upload URL to Analyze the Image
 */
app.post("/upload", upload.single("file"), async (req, res) => {
    const path = req.file.path
    getImageDimensions(path)

    getDominantColour(path);
    try {
        const imageBuffer = fs.readFileSync(path);
        const b = Buffer.from(imageBuffer, "base64");
        const tfimage = tf.node.decodeImage(b);

        const model = await coco_ssd.load();
        const predictions = await model.detect(tfimage, 3, 0.25);
        console.log("predictions: ", predictions);
        res.json(predictions);
    } catch (err) {
        console.log("error: " + err);
    }
});

function getImageDimensions(path) {
    console.log("path 2 : " + path);
    sizeOf(path, function (err, dimensions) {
        if (err) {
            console.log("Error dime: " + err);
        }
        console.log(dimensions.width, dimensions.height);
    });
}

function getDominantColour(path) {
    fs.readFile(path, (err, image) => {
        if (err) {
            console.log("Color error: " + err);
            return;
        }
        console.log("read color");
        var imageData = new Canvas.Image;
        imageData.src = image
        console.log("imagedata : " + imageData.width, imageData.height);
        canvas.width = image.width;
        canvas.height = image.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(imageData, 0, 0, 1, 1);
        const i = ctx.getImageData(0, 0, 1, 1).data
        console.log(`rgba(${i[0]},${i[1]},${i[2]},${i[3]})`);
        console.log("#" + ((1 << 24) + (i[0] << 16) + (i[1] << 8) + i[2]).toString(16).slice(1));
    })

}


/**
 * listen to PORT 5000
 */
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port : ${PORT}`);
});
