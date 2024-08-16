const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(cors());
app.use(fileUpload());

app.post('/check-format', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    console.log('Received file:', file.name);

    // Checking the MIME type of the uploaded file
    const validFormats = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (validFormats.includes(file.mimetype)) {
        console.log('File format is compatible.');
        res.send({ isValid: true, message: 'File format is compatible.' });
    } else {
        console.log('File format not supported:', file.mimetype);
        res.send({ isValid: false, message: 'File format not supported.' });
    }
});

app.listen(port, () => {
    console.log(`Format checker service running on http://localhost:${port}`);
});
