/*
 * Module dependencies
 */
const express = require('express'), stylus = require('stylus'), nib = require('nib');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const url="mongodb+srv://amimiraj:amimiraj@cluster0.neu6m.mongodb.net/movieStore?retryWrites=true&w=majority";
mongoose.connect(url).then(()=>console.log("This is okay")).catch((error)=>console.log("This is error"))


const moveiSchema= new mongoose.Schema({
  title : String,
  actorName:String, 
  releaseDate:String,
  createdAt:{
    type:Date,
    default: Date.now
  }
})

const movieModel=mongoose.model("movie", moveiSchema)



function compile(str, path) {
  return stylus(str).set('filename', path).use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }))

app.use(express.static(__dirname + '/public'))


app.get('/',async  (req, res)=>{
  const movies= await movieModel.find();
  res.render('index',{ record: movies, title:'Home' })
})

app.get('/addMovie', function (req, res) {
  res.render('addMovie',{ title : 'Form' })
})

app.post('/storeData', async (req, res)=> {
  const newMovie = new movieModel({
    title:req.body.title,
    actorName:req.body.actorName,
    releaseDate:req.body.date
  })
   const movieData = await newMovie.save();
   res.redirect('/')
})


app.get('/editMovie/:id',async  (req, res, next)=>{
  const editmovies= await movieModel.findOne({ _id:req.params.id });
  res.render('editMovie',{ record: editmovies, title:'Edit' });

 })


 app.post('/updateMovie/:id',async  (req, res, next)=>{

    const updatemovies= await movieModel.updateOne(
    { _id:req.params.id },
    {$set:{title:req.body.title, actorName:req.body.actorName, releaseDate: req.body.releaseDate }},
    {new:true} );
    res.redirect('/')

 })


 //app.put('/updateMovie/:id',async  (req, res, next)=>{

  //console.log(req.params.id)
 /* const updatemovies= await movieModel.updateOne(
    { _id:req.params.id },
    {$set:{title:req.title, actorName:req.actorName, releaseDate: req.releaseDate }},
    {new:true} );
*/

 //})


app.get('/deleteMovie/:id',async  (req, res, next)=>{
  const dlt= await movieModel.deleteOne({_id: req.params.id});
  res.redirect('/')
})









app.listen(5000)
