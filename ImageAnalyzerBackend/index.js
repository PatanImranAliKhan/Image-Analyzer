import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const express = require("express");
const multer = require("multer");
const cors = require("cors");
var fs = require('fs')
const process = require("process")

import path from 'path';
import * as tf from "@tensorflow/tfjs-node";
const coco_ssd = require("@tensorflow-models/coco-ssd");

const Canvas = require("canvas");
const canvas = Canvas.createCanvas(200, 200)
import Response from './Response.js';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const orgName = file.originalname.split(".");
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage })

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'image-analyzer-frontend')))

/**
 * /api/upload URL to Analyze the Image
 */
app.post("/api/upload", upload.single("file"), async (req, res, next) => {
    const filePath = req.file.path
    getDominantColourAndImageDimensions(filePath);
    try {
        const imageBuffer = fs.readFileSync(filePath);
        const b = Buffer.from(imageBuffer, "base64");
        const tfimage = tf.node.decodeImage(b);

        const model = await coco_ssd.load();
        const predictions = await model.detect(tfimage, 4, 0.25);

        if (predictions.length == 0) {
            if (Response.getDimensions != {}) {
                Response.Status = "Prediction Error";
            }
            Response.setMessage = "Cannot able to Predict, provide the Image in Right Format";
            return res.json(JSON.stringify(Response)).status(400);
        }
        Response.setPredictions = predictions[0].class;
        res.json(JSON.stringify(Response)).status(200);
    } catch (err) {
        if (Response.getDimensions != {}) {
            Response.Status = "Prediction Error";
        }
        Response.setMessage = "Cannot able to Predict, provide the Image in Right Format";
        Response.Prediction = ""
        return res.json(JSON.stringify(Response)).status(400);
    }
});

app.use('/*', function(req,res) {
    res.sendFile(path.join(__dirname, 'image-analyzer-frontend/index.html'))
})

function getDominantColourAndImageDimensions(filePath) {
    try {
        fs.readFile(filePath, async (err, image) => {
            if (err) {
                setError();
                return;
            }
            var imageData = new Canvas.Image;
            imageData.src = image
            canvas.width = image.width, canvas.height = image.height;
            try {
                var ctx = await canvas.getContext('2d');
                await ctx.drawImage(imageData, 0, 0, 1, 1);
                const colordata = ctx.getImageData(0, 0, 1, 1).data;
                const rgbaColor = `rgba(${colordata[0]},${colordata[1]},${colordata[2]},${colordata[3]})`;
                const hexColor = "#" + ((1 << 24) + (colordata[0] << 16) + (colordata[1] << 8) + colordata[2]).toString(16).slice(1);
                const Dimensions = {
                    "width": imageData.width,
                    "height": imageData.height
                }
                const DominantColor = {
                    "rgba": rgbaColor,
                    "hex": hexColor
                }
                Response.setStatus = "Success";
                Response.setMessage = "Success";
                Response.setDimensions = Dimensions;
                Response.setDominantColor = DominantColor;
            } catch (Err) {
                setError();
            }
        })
    } catch (err) {
        setError();
    }
}

function setError() {
    Response.setStatus = "Error";
    Response.setMessage = "Expected image (BMP, JPEG, PNG, or GIF), but got unsupported image type";
    Response.Dimensions = {};
    Response.DominantColor = {};
    Response.Prediction = ""
}

/**
 * listen to PORT 5000
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port : ${PORT}`);
});
