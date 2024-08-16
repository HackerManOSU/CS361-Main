const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const textract = require('textract');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(cors());

app.use(fileUpload());

app.post('/scan-content', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const prohibitedWords = ['prohibited', 'unauthorized']; // Example list

    const scanContent = (text) => {
        const foundWords = prohibitedWords.filter(word => text.includes(word));
        const result = foundWords.length > 0 ? { isValid: false, foundWords } : { isValid: true };
        console.log("Scan result:", result);  // Log the result to see what is being sent back
        return result;
    };

    if (file.mimetype === 'application/pdf') {
        pdfParse(file.data).then(data => {
            const result = scanContent(data.text);
            res.send(result);
        });
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        textract.fromBufferWithMime(file.mimetype, file.data, (err, text) => {
            if (err) {
                res.status(500).send('Error processing file.');
            } else {
                const result = scanContent(text);
                res.send(result);
                console.log('Scanned DOCX')
            }
        });
    } else {
        res.status(400).send('File format not supported.');
    }
});

app.listen(port, () => {
    console.log(`Content scanning service running on http://localhost:${port}`);
});
