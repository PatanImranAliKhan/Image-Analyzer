const express = require("express");
const multer = require("multer")

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

app.post("/upload", upload.single("file"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send("Endpoint for file upload.");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port : ${PORT}`);
});
