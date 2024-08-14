const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(fileUpload());

app.post('/check-age', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file;
    const filePath = path.join(__dirname, file.name);
    const lastModified = req.body.lastModified; // Get lastModified from the client

    console.log('Received file:', file.name);

    // Save the file temporarily
    file.mv(filePath, err => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).send(err);
        }

        console.log('File saved at:', filePath);

        // Use lastModified if available to calculate the age
        if (lastModified) {
            const now = new Date();
            const modifiedTime = new Date(parseInt(lastModified, 10));
            const ageInDays = Math.floor((now - modifiedTime) / (1000 * 60 * 60 * 24));
            console.log('File age in days (using lastModified):', ageInDays);

            // Cleanup: delete the file after checking
            fs.unlink(filePath, unlinkErr => {
                if (unlinkErr) {
                    console.error(`Failed to delete ${filePath}:`, unlinkErr);
                } else {
                    console.log('Temporary file deleted:', filePath);
                }
            });

            // Send back the age of the file in days
            return res.send({ ageInDays });
        } else {
            // Fallback logic if lastModified is not available
            console.log('No lastModified provided, unable to calculate accurate file age');
            return res.send({ ageInDays: 0 });
        }
    });
});


app.listen(port, () => {
    console.log(`File age checker service running on port ${port}`);
});
