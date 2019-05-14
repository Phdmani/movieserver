var createError = require('http-errors');
var express = require('express');
var session=require('express-session');
var bodyParser=require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql=require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var connection = mysql.createPool({
    connectionLimit : 10,
    host:'us-cdbr-iron-east-02.cleardb.net',
    user:'b47874a72e65fc:',
    password:'dfd6a95f',
    database:'heroku_476a20d0ad63d97'

})

var username='';
var password='';
var title = '';

global.db = connection;

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/user-logout', (req,res) =>{
  username ='';
  password ='';
  res.redirect('/');

  console.log('Logged Out')
  console.log('User:'+username)

})



app.post('/user-login',function(req,res){
 
    username=req.body.username;
    password=req.body.password;


    if(username && password){
      db.query('SELECT * FROM UserInfo WHERE username=? AND password=?', [username,password],function(err,results,fields){
        if (err) throw err;
        console.log("Connected!");
        console.log(results)
        if(results.length){
          req.session.loggedin=true;
          req.session.username=username;
          res.redirect('/home');
          console.log('Logged In')
          console.log(username)

          res.end()
        }else{
          res.send("Invalid Username/Password");
        }
      });
    }else{
      res.send("Enter your Username and Password");
      res.end();
    }



});

app.post('/register',function(req,res){
 
    username=req.body.username;
    password=req.body.password;

    console.log(username)
    if(username && password){
      db.query('INSERT INTO UserInfo(username,password) VALUES(?,?)', [username,password],function(err,results,fields){
        if (err) {
          redirect('/register')
          console.log(err);
          throw err;
        }
        console.log("Connected!");
        console.log(results)
        if(results){
          req.session.loggedin=true;
          req.session.username=username;
          res.redirect('/home');
          res.end()
        }else{
          console.log(results.length)
          res.send("Unable To register");
        }
      });
    }else{
      res.send("Please try again");
      res.end();
    }



});

app.post('/user-remove',function(req,res){
 
  id = req.body.id;
  console.log(id);



});


app.post('/userlocal',function(req,res){
 
  lat = req.body.latitude;
  long = req.body.longitude;
  console.log('latitude: '+lat);
  console.log('longitude: '+long);
            if ( username =='') throw err;

      db.query('UPDATE UserInfo SET lat =?, longi=? WHERE username=?',[lat,long,username],function(err,results,fields){
      if (err) throw err;
      console.log('success')


})

});

app.post('/getlocal',function(req,res){
      
      db.query('SELECT lat, longi FROM UserInfo ',function(err,results,fields){
      if (err) throw err;
      


      res.send(results);

      console.log('success')


})

});

app.post('/addfriend', (req,res) =>{

    id =req.body.us

      console.log(username)
      console.log(id)

      if ( username =='') throw err;
        db.query(`INSERT into Friendlist (username,friend) VALUES('${username}','${id}')`,function(err,results,fields){
        if (err) throw err;
        console.log('success')


})

});

app.post('/user-add-movies', (req,res) =>{
    title =req.body.user
    poster =req.body.poster


      console.log(title)
      console.log(poster)
      console.log(username)
      if ( username =='') throw err;
        db.query(`INSERT into Movies (title,users,poster) VALUES('${title}','${username}','${poster}')`,function(err,results,fields){
        if (err) throw err;
        console.log('success')


})

});



app.get('/user-a-movies',function(req,res){
    console.log(username)
        db.query('SELECT * FROM Movies WHERE users<>?', [username],function(err,results,fields){
        if (err) throw err;
        res.send(results);
        console.log(results)
        console.log('success')


})

});

app.get('/getusers',function(req,res){
    console.log(username)
        db.query('SELECT * FROM Friendlist WHERE username =? ', [username],function(err,results,fields){
        if (err) throw err;
        res.send(results);
        console.log(results)
        console.log('success')


})

});

app.post('/usersearch',function(req,res){
      user=req.body.user;

    console.log("nod:"+user)
        console.log("username:"+username)

        db.query('select username from UserInfo where username LIKE ? union select friend from Friendlist where username != ?', ['%'+user+'%',username],function(err,results,fields){

        if (err) throw err;
        res.send(results);
        console.log(results)
        console.log('success')


})

});

app.post('/signup',function(req,res){

    username=req.body.username;
    password=req.body.password;


    if(username && password){
      db.query(`INSERT into userinfo (username,password)
      VALUES('${username}','${password}')`,function(err,result){
        if(err) throw err;
        console.log(result);
        res.send('success');
      });
    }else{
      res.send("Enter your Username and Password");
      res.end();
    }


});


app.post('/remove-movie', (req,res) =>{
    id =req.body.id

    console.log(id)
      if ( username =='') throw err;
        db.query('DELETE FROM Movies WHERE id =?',[id],function(err,results,fields){
        if (err) throw err;
        console.log('success')


})

});


const host = 'localhost';
const port = process.env.PORT || 3000;



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
