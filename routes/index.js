var express = require('express');
var router = express.Router();
var connection = require("../config/connection");

router.get('/', function(req, res, next) {
    res.render('index');
});

//register page
router.get('/register', function(req, res, next) {
    res.render('register');
});

router.post('/registerUser', function(req, res) {
    const customerdata ={
      name:req.body.name,
      email:req.body.email,
      nic:req.body.nic,
      username:req.body.username,
      password:req.body.password
    }

    var username =req.body.username;

    connection.query("SELECT * FROM users WHERE username=?",[username],function(err,rows){
      if(rows.length == 0){
          connection.query("INSERT INTO users SET ?", customerdata,function(err,result){
            if(err) throw err;
            res.render('login');
          });
      }else{
          console.log("Please check username again");
      }
    });
});

//login page
router.get('/login', function(req, res, next) {
    res.render('login');
});

router.post('/loginUser', function(req, res) {

    var username =req.body.username;
    var password =req.body.password;

    connection.query("SELECT * FROM users WHERE username=? and password=?",[username,password],function(err,rows){
      if(rows.length == 0){
        console.log("Please check username and password");
      }else{
        connection.query("SELECT * FROM task",function(err,rows){
          if (err) throw err;
          res.render('index2', { tasks : rows});
        });
      }
    });
});


/* GET home page. */
router.get('/index2', function(req, res, next) {
  connection.query("SELECT * FROM task",function(err,rows){
    if (err) throw err;
    res.render('index2', { tasks : rows});
  });

});


//add task
router.post('/addTask',function(req,res){
  const userdata={
    task_name : req.body.task_name
  };
  connection.query("INSERT INTO task SET ?",userdata,function(err,result){
    connection.query("SELECT * FROM task",function(err,rows){
      if (err) throw err;
      res.render('index2', { tasks : rows});
    });
  });
})


//delete task
router.get('/deleteTask/:id',function(req,res){
  var id = req.params.id;
  connection.query("DELETE FROM task WHERE id = ?",[id],function(err,result){
    connection.query("SELECT * FROM task",function(err,rows){
      if (err) throw err;
      res.render('index2', { tasks : rows});
    });
  });

});


//edit tasks
router.get('/editTask/:id',function(req,res){
    var id = req.params.id;
    connection.query("SELECT * FROM task WHERE id=?",[id],function(err,rows){
      if(err) throw err;
      res.render('edit',{taskdata:rows});
    });
});

//edit task
router.post("/edit/:id",function(req,res){

  var task_name = req.body.task_name;
  var  id = req.params.id;

  connection.query("UPDATE task SET task_name= ? WHERE id=?",[task_name,id],function(err,repond){
  if(err) throw err;
    connection.query("SELECT * FROM task",function(err,rows){
      if (err) throw err;
      res.render('index2', { tasks : rows});
    });
  });
});



module.exports = router;
