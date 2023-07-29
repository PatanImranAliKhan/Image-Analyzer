const express = require("express");
const multer = require("multer")
const cors = require("cors")
var sizeOf = require('image-size');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
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
app.post("/upload", upload.single("file"), (req, res) => {
    const path = req.file.path
    console.log("path: ", path);
    AnalyzeImage(path)
    res.send("Endpoint for file upload.");
});

function AnalyzeImage(path) {
    sizeOf(path, function (err, dimensions) {
        console.log(dimensions.width, dimensions.height);
    });
}

/**
 * listen to PORT 5000
 */
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port : ${PORT}`);
});
