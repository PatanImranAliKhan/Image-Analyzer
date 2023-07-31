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
app.post("/upload", upload.single("file"), async (req, res, next) => {
    const path = req.file.path
    await getDominantColourAndImageDimensions(path)
    .then((resp) => {
        console.log("dim resp: "+JSON.stringify(resp))
        if(resp['Status'] === "Error") {
            res.send(resp);
            next();
        }
    })
    .catch((err) => {
        console.log("Error in dominant color : "+err)
    })
    
    
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

async function getDominantColourAndImageDimensions(path) {
    let resp = {
        "Status": "Error",
        "Message": "Expected image (BMP, JPEG, PNG, or GIF), but got unsupported image type" 
    }
    try {
        fs.readFile(path, async (err, image) => {
            if (err) {
                console.log("readfile err: " + err);
                console.log("end 1")
                return resp;
            }
            console.log("read color");
            var imageData = new Canvas.Image;
            imageData.src = image
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = await canvas.getContext('2d');
            await ctx.drawImage(imageData, 0, 0, 1, 1);
            const colordata = await ctx.getImageData(0, 0, 1, 1).data;
            const rgbaColor = `rgba(${colordata[0]},${colordata[1]},${colordata[2]},${colordata[3]})`;
            const hexColor = "#" + ((1 << 24) + (colordata[0] << 16) + (colordata[1] << 8) + colordata[2]).toString(16).slice(1);
            console.log(rgbaColor, "  ", hexColor)
            console.log("end 2")
            resp = {
                "Status": "Success",
                "Message": {
                    "Dimensions": {
                        "width": imageData.width,
                        "height": imageData.height
                    },
                    "DominantColor": {
                        "rgba": rgbaColor,
                        "hex": hexColor
                    }
                }
            }
            return resp;
        })
    } catch (err) {
        console.log("end 3")
        console.log("image colour: " + err);
        resp = { "Error": "Expected image (BMP, JPEG, PNG, or GIF), but got unsupported image type" }
    }
    console.log("end 4");
    console.log(resp)
    return resp;
}


/**
 * listen to PORT 5000
 */
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port : ${PORT}`);
});
