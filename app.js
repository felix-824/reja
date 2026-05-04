console.log("Web Serverni boshlash");
const express = require("express");     // express kutubxonasini chaqiramiz
const app = express();                  // express app yaratamiz (asosiy server obyekt)
const fs = require("fs");


let user;
fs.readFile("database/user.json", "utf-8", (err, data) => {
   if(err) {
      console.log("ERROR:", err);
   } else {
      user = JSON.parse(data)
   }
});

//MongoDB Chaqirish
const db = require("./server").db();
const mongodb = require("mongodb");

// 1 Kirish code
app.use(express.static("public"));  // DP Middleware - publicni ochiqlash
app.use(express.json()); //DP Middleware  REST api ga xizmat   / JSON formatdagi ma’lumotni o‘qish uchun
app.use(express.urlencoded({extended: true}));  //DP Middleware  Traditional api ga xizmat / formdan kelgan ma’lumotni o‘qish uchun
// 2 Session code
// 3 Views code
 app.set("views", "views");  // view/ejs fayllar qayerda joylashganini ko‘rsatamiz
 app.set("view engine", "ejs");  //qaysi formatda ( BSSR)   // EJS template engine ishlatishni aytadi

 // 4 Routing code
 // POST request (frontenddan ma’lumot keladi)
 app.post("/create-item", (req, res) => {    ///create-item" =>  http://localhost:3000/create-item   
    console.log("user entered / create-item");
    const new_reja = req.body.reja;   // .body=> user yuborgan data /.reja=> formdagi input nomi user yozdi > IT urganamiz
    //req.body = { reja: "IT urganamiz"} => new_reja = "IT urganamiz"
    db.collection("plans").insertOne({ reja: new_reja }, (err, data) => {  //collection = jadval /.insertOne(...) =databaseda 1 ta ma’lumot qo‘shadi
     console.log(data.ops);
     res.json(data.ops[0]);
    });
 });

 app.post("/delete-item", (req, res) => {
   const id = req.body.id;
   db.collection("plans").deleteOne(
      {_id: new mongodb.ObjectId(id) },
       function (err,data) {
         res.json({state: "success"});
   });
 });


 app.post("/edit-item", (req, res) => {
   const data = req.body;
   console.log(data);
   db.collection("plans").findOneAndUpdate(
      {_id:new mongodb.ObjectId(data.id) },
      {$set: {reja: data.new_input } },
      function (err, data) {
         res.json({state: "succses"});
      }
   );
 });


 

 app.get('/author', (req, res) => {  //'/author' http://localhost:3000/author
   res.render("author", {user: user });  //.res.render= HTML (EJS) sahifa chiqaradi
 });


 app.post("/delete-all", (req, res) => {
   if (req.body.delete_all) {
      db.collection("plans").deleteMany(function () {
         res.json({ state: "hamma rejalar ochirildi"});
      });
   }
 });


 
 app.get("/", function (req, res) {      // GET request (asosiy sahifa) http://localhost:3000
   console.log('user entered /');
   db.collection("plans")
   .find()  //ma’lumotlarni qidiradi / oladi
   .toArray((err, data) => {
      if (err) {
         console.log(err);
         res.end("something went wrong");
      } else {
         res.render("reja", { items: data }); //res.render=sahifa chiqaradi  / "reja" =>view nomi file:views/reja.ejs
         //{ items: data }=>
      }
   });
 });

module.exports = app;
