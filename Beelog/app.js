
const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Blogs = require('./models/blog');
const Logs = require('./models/registerdb')

const parse = require('body-parser');
const cookieParser = require('cookie-parser');

const  dotenv  = require('dotenv') 
dotenv.config()

 
var app = express();
app.use(parse.json())
app.use(parse.urlencoded({ extended: true }))
app.use(cookieParser());

require('dotenv').config();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine','ejs')


  const url = "mongodb+srv://"+`${process.env.NAME}`+":"+`${process.env.PASS}`+"@node.tscnl.mongodb.net/sampledata?retryWrites=true&w=majority"
  mongoose.connect(url,function(err){
    
    app.listen('8080',function(res,req){
      console.log("server started")
    
    /*  require('child_process').exec('start http://localhost:8080/');  */
    
     }) 
 
    console.log("connected to DB")
   
   });
   

// setting user by cookie
 function setUser(req,res,next){
  
  if(req.cookies.name){
        console.log("Logged using cookie")
        next()
     
       
      }
          else{
     
         
         res.redirect('/login')
         } 
     }
  
 

 


//All blog
app.get('/add-blog',setUser,function(req,res){
  res.render('add');
})

//Saving new blog content to moongose
app.post('/new-blog',urlencodedParser,function(req,res){
  let  data  =req.body;
  
 
  
  const blog = new Blogs({

    title:data.title,
    body:data.body,
    author:req.cookies.name
  })
  
  blog.save()
   .then((result)=>{
     res.setHeader('Content-Type', 'text/plain');
     res.redirect('/all-blog')
   })
   


})
//Dashboard
app.get('/dashboard',setUser,function(req,res,next){
console.log("in dashboard")
console.log(req.cookies.name)
  Blogs.find({author:req.cookies.name})
  .then((result)=>{
   console.log(result)
    let amount = result.length;
    console.log(amount)
    res.render('dashboard',{blogs:result,totalBlog:amount,name:req.cookies.name})

  })

})
app.get('/about',function(req,res){
  res.render('about')
 
})
app.get('/all-blog',setUser,function(req,res){
  console.log("all-blog")
  Blogs.find()
   
   .then((result)=> {
     res.render('index',{blogs:result})
   
     
   })
  

})




  
app.get('/',setUser,function(req,res){
  console.log("alll-blog")
  
  
  Blogs.find()
   .then((result)=> {
     res.render('index',{blogs:result})
     
   })
  

})



//LOGIN

app.get('/login',function(req,res,next){
res.render('login')
})



//LOGIN AUTH
app.post('/logauth',function(req,res,next){
     const name = req.body.name;
     const password = req.body.password;
   Logs.find({name:name})
     .then((result)=>{
       
        if(result.length==0){
          res.send("Wrong Information,Please try again !<a href='/login'>back </a>")
          console.log("in 1")
        }
        else{
          console.log("in 2")
         result.forEach((user)=>{
              const passAuth = user.password;
        
             
                 if(passAuth == password){
                      console.log("Correct passwoord")
                      res.cookie("name",req.body.name, {expire: 4000000 + Date.now()})
                      console.log("Cookie created")
                      res.redirect('/all-blog')
   
                     }
                  else{
     
                      res.send("Wrong Information,Please try again")
                     }
                  }
   
           )}
     })
   
    
    
  
 

  
})

//REGISTER
app.get('/register',function(req,res,next){
  res.render('register')
  })
//REGISTER AUTH


app.post('/registerauth',function(req,res,next){
  const name = req.body.name;
  
  Logs.find({name:name})
  .then((result)=>{
  
     if(result.length==0){
      const info = new Logs({
        name:req.body.name,
        password:req.body.password
           })
        
        console.log("user created");
        info.save()
        res.redirect('/login')
     }
     else{
       res.send("User already exists <a href='/register'>Back</a>")
     }
  
     
    })       
              
 
})



//SHOW CLICKED BLOG

app.post('/show',function(req,res,next){
 let blog_id = req.body.blogid;
 
 Blogs.find({_id:blog_id})
 .then((result)=> {
  res.render('showblog',{blogs:result})
  
})

})


//logout

app.get('/logout',function(req,res,next){
  res.clearCookie("name");
  res.redirect('/all-blog')
})



//DELETE

app.post('/delete',function(req,res,next){
const id = req.body.blogid;
console.log(id)
Blogs.findByIdAndDelete({_id:id})
.then(()=>{
  console.log('deleted')
  res.redirect('/dashboard')
})



})