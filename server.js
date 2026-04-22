console.log("Web Serverni boshlash");
// express kutubxonasini chaqiramiz
const express = require("express");

// express app yaratamiz (asosiy server obyekt)
const app = express();

// http modulini chaqiramiz (serverni ishga tushirish uchun)
const http = require('http');
const fs = require("fs");

let user;
fs.readFile("database/user.json", "utf-8", (err, data) => {
   if(err) {
      console.log("ERROR:", err);
   } else {
      user = JSON.parse(data)
   }
});

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

    // req.body → frontenddan kelgan data
    console.log(req.body);
    

     // clientga JSON javob qaytaramiz
    res.json({test: "success"});
 })

 app.get('/author', (req, res) => {
   res.render("author", {user: user });
 });

 // GET request (asosiy sahifa)
 app.get("/", function (req, res) {
    // views papkadagi harid.ejs faylni render qiladi
    res.render("harid");
 });


 // ==========================
// SERVERNI ISHGA TUSHIRISH
// ==========================

// express app ni http serverga ulaymiz
const server = http.createServer(app);
// port tanlaymiz
let PORT = 3000;
// serverni ishga tushiramiz
server.listen(PORT, function () {
    console.log(`The server is running successfully on port ${PORT}`); 
});