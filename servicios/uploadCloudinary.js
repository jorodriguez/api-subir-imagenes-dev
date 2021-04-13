
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');


//en caso de usar mas de una cuenta de cloudnary conectar estas credenciasles a una base de datos
cloudinary.config({
    cloud_name: 'hjxjcdupm',
    api_key: '126569266916488',
    api_secret: 'Pka9QCcnwfl-gggM0wKJrOs8KcQ'
});

const streamUpload = (buffer,folder) => {
    return new Promise((resolve, reject) => {

        if(!buffer || buffer == null || !folder || folder==null){
            reject({error:"Valores requeridos para subir (imagen o folder )."});
        }

        let stream = cloudinary.uploader.upload_stream(
            { folder: folder },
            (error, result) => {
                if (result) {
                    console.log("Upload Ok " + result);
                    resolve(result);
                } else {
                    console.log("Error " + result);
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};


module.exports = {streamUpload};