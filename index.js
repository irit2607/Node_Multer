const express = require('express');
const csrf = require('csurf');
var expressSesion = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();

app.set('veiw engine', 'ejs');
app.set('veiws',__dirname + '/veiws');
app.use(express.urlencoded({ extended : true}));

//multer

const storage = multer.diskStorage({
    destination : 'public/uploads' ,
    filename: function(req,file,cb){
        cb(null, 'file' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage : storage,
    fileFilter : function (req, file, cb){
        var validextensions = ['.png' , '.jpg', '.jpeg'];
        var ext = path.extname(file.originalname);
        if(!validextensions.includes(ext)){
            return cb(new Error("Please choose .png, .jpg or .jpeg files!"));
        }
        cb(null,true);  // error - null , file - true
    },
    limits : {fileSize:125000 * 10},
});

app.use(expressSesion({
    secret : 'random',
    resave : true,
    saveUninitialized:true,
    maxAge : 24 * 60 *60 *1000,
}));


app.get('/',(req,res) => {
    res.render('index.ejs');
});

app.get('/multiple',(req,res) => {
    res.render('multiple.ejs');
});

app.post('/upload', (req, res) => {
    console.log(req.body);
    upload.single('file')(req,res,(err) => {
        if(err)
        {
            res.render('index', {err:err});
        }else{
            console.log(req.body);
            res.redirect("/");
        }
    });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));