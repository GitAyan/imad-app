var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var app = express();
var crypto= require('crypto');
var bodyParser=require('body-parser');
var session=require('express-session');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
secret: 'ValueRandom',
cookie: {maxAge: 1000*60*60*24*30}
}));
//Home page bruv
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});





//db EX3 Good one
var config={
    user: 'endecipher',
    database: 'endecipher',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
    ////////instead of process.env.DB_PASSWORD (Wasn't working)
};


var pool= new Pool(config);
app.get('/dbarticles/:aname', function(req,res){
   pool.query('Select * from article where title= $1', [req.params.aname], function(err,result){
        if (err){
          res.status(500).send(err.toString());
        }
        else{
          if(result.rows===0){
            res.status(404).send(" Article not found ")
          }
          else{
            res.send(crTemplate(result.rows[0]));
            //res.send(JSON.stringify(result.rows);
            //or if you want whole result , (result)
          }
         }
    });
});
function crTemplate(data){
var title=data.title;
var heading=data.heading;
var content=data.content;
var date=data.date;
var HTMLTemplate=`
<html>
    <head>
        <title>
        ${title}
        </title>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
         <h1><center>${heading}</center></h1>
         ${content}
         <hr>
         <h4> ${date} </h4>
         <h4> Now this: ${date.toDateString()} is using .toDateString() function <h4>
         <hr>
        <script type="text/javascript" src="/ui/main.js">
        </script>
    </body>
</html>`;
return HTMLTemplate;
}
//db EX3ends



//Module4 (Hash,Sessions,Curl) etc.
function hash(input,salt){
var hash=crypto.pbkdf2Sync(input,salt,10000,512,'sha512').toString('hex');
return ['pbkdf',10000,salt,hash].join('$');

}


app.get('/password/:input', function(req,res){
    var hashedString=hash(req.params.input,'this-salt-value');
    res.send(hashedString.toString()+"<hr>"+ hashedString.split('$')[3].length);
    
});

app.post('/create-user',function(req,res){
    //we have usern,password
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbstring=hash(password,salt);
    pool.query('Insert into users(username,password) values($1,$2)',[username,dbstring],function(err,result){
        if(err){
          res.status(500).send(err.toString());
        } else{
          res.send("User Created Successfully");
        }
    });

});

app.post('/login',function(req,res){
    //we have usern,password
    var username=req.body.username;
    var password=req.body.password;
    
    pool.query('select * from users where username=$1',[username],function(err,result){
        if(err){
          res.status(500).send(err.toString());
        } else{
            if(result.rows.length===0){
                res.status(403).send("Forbidden | No user");
            }
            else{
                var dbString=result.rows[0].password;
                var salt=dbString.split('$')[2];
                var hashedPassword=hash(password,salt);
                if(hashedPassword===dbString){
                   
                    req.session.auth={userid: result.rows[0].userid};
                     res.send("Logged In!");
                }
                else{
                    res.send("Unknown error. Invalid Credentials."); 
                }
            }
          
        }
    });

});



app.get('/log', function(req,res){
     console.log(JSON.stringify(req.session.auth));
     if(req.session && req.session.auth && req.session.auth.userid){
         res.send("You are logged in as UserID: "+ req.session.auth.userid.toString());
     }
     else{
         res.send("Hey?");
     }
});


app.get('/logout', function(req,res){
     delete req.session.auth;
     res.send("Logged Out.");
     
});






//M4 ends
















//Returns a list of users After submitting a user's name in index.html
//and displays it in <ul>.innerHTML also,
// submit?name= is why we use req.query.names and not req.params.name
//Use JSON stringify to convert Javascript Array to String and use send()
//And in main.js, JSON.parse to convert back to array, after retrieval;
var names=[];
app.get('/submit',function(req,res){
  var namegotten=req.query.name;
  names.push(namegotten);
  res.send(JSON.stringify(names));
});






//access counter endpoint using Button AJAX API call from index.html
//Does not refresh content and values changes when button counter is clicked
//Because we make XMLHTTPRequest to counter endpoint which increments value
//from main.js
var counter=0;
app.get('/counter', function (req, res) {
  counter=counter+1;
  res.send("<h3>"+counter.toString()+"</h3>");
});





//Send a request for Main.js to work.
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});







//This will send Article 2 to render htmlcode using Create template function
//Remember, I had to create crTemplate in the beginning because my database
//had another column date.
//Otherwise, direct content can be rendered using server side HTML
var article2={
title:'Article 2 is in the form of a template',
heading:'ARTICLE TWO PICKLE RICK!!!!',
content:`
<div class="center">
    <img src="/ui/madi.png" class="img-medium"/>
</div>
<br>
<div class="center text-big bold">
    Hi! I am your webapp.
</div>
<div>`
};

function createTemplate(data){
var title=data.title;
var heading=data.heading;
var content=data.content;
var HTMLTemplate=`
<html>
    <head>
        <title>
        ${title}
        </title>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
         <h1><center>${heading}</center></h1>
         ${content}
        <script type="text/javascript" src="/ui/main.js">
        </script>
    </body>
</html>`;
return HTMLTemplate;
}

app.get('/article-two',function (req,res){
  res.send(createTemplate(article2));
});


//This below will send article-one html directly
app.get('/article-one',function (req,res){
  res.sendFile(path.join(__dirname,'ui','article-one.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
