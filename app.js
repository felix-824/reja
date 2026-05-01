console.log("Web Serverni boshlash");
// express kutubxonasini chaqiramiz
const express = require("express");
// express app yaratamiz (asosiy server obyekt)
const app = express();
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

// 1 Kirish code

// "public" papkadagi fayllarni browserga ochib beradi
// masalan: public/img.png → localhost:3000/img.png
app.use(express.static("public"));

// JSON formatdagi ma’lumotni o‘qish uchun
// (frontenddan JSON yuborilsa ishlaydi)
app.use(express.json());

// formdan kelgan ma’lumotni o‘qish uchun
// (input, form submit)
app.use(express.urlencoded({extended: true}));

// 2 Session code
// 3 Views code

// view fayllar qayerda joylashganini ko‘rsatamiz
 app.set("views", "views");

 // EJS template engine ishlatamiz
 app.set("view engine", "ejs");

 // 4 Routing code
 // POST request (frontenddan ma’lumot keladi)
 app.post("/create-item", (req, res) => {    ///create-item" =>  http://localhost:3000/create-item   
    console.log("user entered / create-item");
   
    const new_reja = req.body.reja;   // .body=> user yuborgan data /.reja=> formdagi input nomi user yozdi > IT urganamiz
    //req.body = { reja: "non olish"} => new_reja = "non olish"
    db.collection("plans").insertOne({ reja: new_reja }, (err, data) => {  //collection = jadval /.insertOne(...) =databaseda 1 ta ma’lumot qo‘shadi
     console.log(data.ops);
     res.json(data.ops[0]);
    });
 });

 app.get('/author', (req, res) => {  //'/author' http://localhost:3000/author
   res.render("author", {user: user });  //.res.render= HTML (EJS) sahifa chiqaradi
 });
 // GET request (asosiy sahifa)
 app.get("/", function (req, res) {  //http://localhost:3000/ /
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
