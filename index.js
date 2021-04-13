const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')
const dotenv = require('dotenv').config();
const multer = require('multer');
const fileUpload = multer();

const uploadCloudinary = require('./servicios/uploadCloudinary');
const constantes = require('./constantes/Constantes');
const version = '/v1/';

if (typeof (process.env.CLOUDINARY_URL) === 'undefined') {
    console.warn('!! cloudinary config is undefined !!');
    console.warn('export CLOUDINARY_URL or set dotenv file');
} else {
    console.log('cloudinary config:');
    // console.log(cloudinary.config());
}
const port = process.env.PORT || 5100;
const version = "primer-uso";

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Origin,Accept,Authorization,x-access-token'); // If needed	
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    next();
});


app.get('/', (request, response) => {
    console.log(process.env);
    console.log("=====================");
    response.json({ info: `Api-subir-imagenes ${version} (env:${process.env.ENV})` });
});


app.get(version+'/imagen', function (req, res) {
    res.send('<form method="post" enctype="multipart/form-data">'
        + '<p>Public ID: <input id="title" type="text" name="title"/></p>'
        + '<p>Image: <input type="file"  accept="image/*" name="image"/></p>'
        + '<p><input type="submit" value="Upload"/></p>'
        + '</form>');
});

//parametros {file:file,folder}
app.post('/imagen', fileUpload.single('image'), function (req, res, next) {
    async function upload() {
        try {
            let result = await uploadCloudinary
                .streamUpload(
                    req.file.buffer,
                    constantes.FOLDER_PERFILES_CLOUDNARY
                );
            res.status(200).json({ upload: true, ...result });
            console.log(result);
        } catch (error) {
            console.log("Error al cargar la imagen " + error);
            res.status(400).json({ upload: false, error: error });
        }
    }
    upload();
});
/*
app.post('/imagen', function (req, res, next) {
    try {
        //console.log(" "+JSON.parse(req.body));
        stream = cloudinary.uploader.upload_stream(function (result) {
            console.log(result);
            res.send('Done:<br/> <img src="' + result.url + '"/><br/>' +
                cloudinary.image(result.public_id, { format: "png", width: 100, height: 130, crop: "fill" }));
        }, { public_id: req.body.title });

        fs.createReadStream(req.files.image.path, { encoding: 'binary' }).on('data', stream.write).on('end', stream.end);

    } catch (e) {
        console.log("Error " + e);
    }

});*/


app.listen(port, () => {
    console.log(`App corriendo en el puerto ${port} ${version} (env:${process.env.ENV})`);
});
