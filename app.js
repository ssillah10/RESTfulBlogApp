const express          = require('express'),
      methodOverride   = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      app              = express(),
      mongoose         = require('mongoose'),
      bodyParser       = require('body-parser'),
      request          = require('request');
     

//   APP CONFIG
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.set('view engine','ejs');

    //   DB SETUP
mongoose.connect('mongodb://localhost:27017/blog_app',{
    useUnifiedTopology:true,
    useNewUrlParser: true
})
.then(() => console.log('Connected to the DB'))
.catch(err => console.log(err));

// MONGOOSE CONFIG
const blogpostSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})

let Blogpost = mongoose.model('Blogpost',blogpostSchema);

// Blogpost.create({
//     title:"Test Blog",
//     image:"https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&h=350",
//     body: "I'm baby pBR&B stumptown woke, drinking vinegar ethical iPhone retro meggings tousled raw denim skateboard you probably haven't heard of them sriracha. Hella tousled drinking vinegar normcore kitsch copper mug chicharrones hoodie man braid yuccie shabby chic before they sold out slow-carb truffaut." 
    
// },function(err,blog){
//     if(err){
//         console.log(err)
//     }else{
//         console.log('Blog Post Added');
//         console.log(blog)
//     }
// })

// RESTFUL ROUTES

// LANDING PAGE
app.get('/',function(req,res){
    res.redirect('/blogs');
})

// INDEX ROUTE
app.get('/blogs',function(req,res){
    let blogposts = Blogpost.find({},function(err,allposts){
        if(err){
            console.log(err)
        } else {res.render('index',{blogposts:allposts});
    }
    })
    
})

// NEW ROUTE
app.get('/blogs/new',function(req,res){
    res.render('new');
})

// CREATE ROUTE 
app.post('/blogs',function(req,res){
    let data = req.body.blog;
    data.body = req.sanitize(data.body); 
    Blogpost.create(data,function(err,blog){
        if(err){
            console.log(err)
        }else{
            res.redirect('/blogs');
        }
    })
   
})

// SHOW ROUTE 

app.get('/blogs/:id',function(req,res){
    Blogpost.findById(req.params.id,function(err,foundBlog){
        if (err){
            console.log(err)
            res.redirect('/blogs')
        } else {
            res.render('show',{blog:foundBlog});
        }
    })
    
})

// EDIT ROUTE
app.get('/blogs/:id/edit',function(req,res){
    Blogpost.findById(req.params.id,function(err,foundBlog){
        if (err) {
            console.log(err)
            res.redirect('/blogs')
        } else{
            res.render('edit',{blog:foundBlog});
        }
    })
    
})


// UPDATE ROUTE

app.put('/blogs/:id',function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blogpost.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/'+req.params.id);
        }
    })
    
    
})

// DELETE ROUTE
app.delete('/blogs/:id',function(req,res){
    Blogpost.findByIdAndRemove(req.params.id,function(err){
        if (err){
            console.log(err);
            res.send('SOMETHING WENT WRONG');
        } else{
            res.redirect('/blogs');
        }
    })
})


app.listen(3000,function(){
    console.log('Blog App Server Started!');
})
