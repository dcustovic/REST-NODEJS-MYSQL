const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');


const appexpress = express();

let mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "testing",
  multipleStatements: true
}); 


appexpress.use(bodyparser.json());


mysqlConnection.connect(function(err) {
  if (err) throw err;
  console.log("MySQL DB connected.");
});


appexpress.listen(8080, () => {
  console.log("AppExpress server is running on port: 8080.")
});




//GET all people
appexpress.get("/db", (req, res) => {
    mysqlConnection.query("SELECT * FROM people", (err, rows, fields) => {
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
}); 

//GET a person
appexpress.get("/db/:id", (req, res) => {
  mysqlConnection.query("SELECT * FROM people WHERE PersonID = ?", [req.params.id], (err, rows, fields) => {
      if(!err)
      res.send(rows);
      else
      console.log(err);
  })
}); 

//DELETE a person
appexpress.delete("/db/:id", (req, res) => {
  mysqlConnection.query("DELETE FROM people WHERE PersonID = ?", [req.params.id], (err, rows, fields) => {
      if(!err)
      res.send("Izbrisano.");
      else
      console.log(err);
  })
}); 

//INSERT a person
appexpress.post("/db", (req, res) => {
  let obj = req.body;
  let sql = "SET @PersonID = ?; SET @LastName = ?; SET @FirstName = ?; SET @Address = ?; SET @City = ?; \
  CALL peopleAddorEdit(@PersonID, @LastName, @FirstName, @Address, @City);"
  mysqlConnection.query(sql, [obj.PersonID, obj.LastName, obj.FirstName, obj.Address, obj.City], (err, rows, fields) => {
      if(!err)
        rows.forEach(element => {
          if(element.constructor == Array)
          res.send('Ubacen person id: ' + element[0].PersonID);
        })
      else
        console.log(err);
  })
}); 


//UPDATE a person
appexpress.put("/db", (req, res) => {
  let obj = req.body;
  let sql = "SET @PersonID = ?; SET @LastName = ?; SET @FirstName = ?; SET @Address = ?; SET @City = ?; \
  CALL peopleAddorEdit(@PersonID, @LastName, @FirstName, @Address, @City);"
  mysqlConnection.query(sql, [obj.PersonID, obj.LastName, obj.FirstName, obj.Address, obj.City], (err, rows, fields) => {
      if(!err)
        res.send('Azurirano.')
      else
        console.log(err);
  })
}); 