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
 app.post("/create-item", (req, res) => {
    console.log("user entered / create-item");
   
    const new_reja = req.body.reja;
    db.collection("plans").insertOne({ reja: new_reja }, (err, data) => {
      if (err) {
         console.log(err);
         res.end("something went wrong");
      } else {
         res.end("successfully added");
      }
    });

   //   // clientga JSON javob qaytaramiz
   //  res.json({test: "success"});
 });

 app.get('/author', (req, res) => {
   res.render("author", {user: user });
 });

 // GET request (asosiy sahifa)
 app.get("/", function (req, res) {
   console.log('user entered /');
   db.collection("plans")
   .find()
   .toArray((err, data) => {
      if (err) {
         console.log(err);
         res.end("something went wrong");
      } else {
         res.render("reja", { items: data });
      }
   });
 });

module.exports = app;
