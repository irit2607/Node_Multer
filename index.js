const express = require('express');
const csrf = require('csrf');
var expressSeesion = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();

app.set('veiw engine', 'ejs');
app.set('veiws',__dirname + '/veiws');

//multer

const storage = multer.diskStorage({
    destination : '/public/uploads',
    filename: function(req,file,callback){
        callback(null, 'file', + Date.now() + path.extension(file,originalname));
    }
});

const upload = multer({
    storage : storage,
    fileFilter : function(req, file, callback){
        var validextensions = ['.png' , '.jpg', '.jpeg'];
        var ext = path.extname(file.originalname);
        if(! validextensions.includes(ext)){
            return callback(new Error("Please choose .png, .jpg or .jpeg files!"));
        }
        callback(null,true);  // error - null , file - true
    },
    limits : {fileSize:125000 * 10},
});

app.use(expressSeesion({
    secret : 'random',
    resave : true,
    saveUninitialized:true,
    maxAge : 24 * 60 *60 *1000,
}));

app.use(csrf());

app.get('/',(req,res) => {
    res.render('index.ejs');
});

app.get('/multiple',(req,res) => {
    res.render('multiple.ejs');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));