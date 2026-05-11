console.log("Web Serverni boshlash");
const express = require("express");     // express kutubxonasini chaqiramiz
const app = express();                  // express app yaratamiz (asosiy server obyekt)
const fs = require("fs");               //file system (fayl o‘qish)


let user;  //user data saqlanadi
fs.readFile("database/user.json", "utf-8", (err, data) => {    //faylni async o‘qiydi
   if(err) {
      console.log("ERROR:", err);
   } else {
      user = JSON.parse(data)   //string → objectga aylantiradi
   }
});

//MongoDB Chaqirish
const db = require("./server").db(); //server.js dan DB ni olib keladi
const mongodb = require("mongodb");  //ObjectId ishlatish uchun

// 1 Kirish code
app.use(express.static("public"));  // DP Middleware -public papkani browserga ochadi
app.use(express.json()); //DP Middleware  REST api ga xizmat   / JSON formatdagi ma’lumotni o‘qish uchun
app.use(express.urlencoded({extended: true})); //DP Middleware  Traditional api ga xizmat/formdan kelgan ma’lumotni o‘qish uchun
// 2 Session code
// 3 Views code
 app.set("views", "views");  // view/ejs fayllar qayerda joylashganini ko‘rsatamiz
 app.set("view engine", "ejs");  //Backenda → HTML yaratadi (SSR)  //qaysi formatda ( BSSR)  

 // 4 Routing code
 // POST request (frontenddan ma’lumot keladi)
 app.post("/create-item", (req, res) => {    ///create-item" =>  http://localhost:3000/create-item   
    console.log("user entered / create-item");
    console.log("STEP2 Backenda")
    console.log("STEP3 Backenda=>D.B")
    const new_reja = req.body.reja;   // .body=> user yuborgan data /.reja=> formdagi input nomi user yozdi > IT urganamiz
    //req.body = { reja: "IT urganamiz"} => new_reja = "IT urganamiz"
    db.collection("plans").insertOne({ reja: new_reja }, (err, data) => {  //collection = jadval /.insertOne(...) =databaseda 1 ta ma’lumot qo‘shadi
     console.log("malumot qushildi", data.ops);  //yangi qo‘shilgan data
     console.log("STEP4 DB => Backenda")
     console.log("STEP5 Backenda => FrontEnd ")
     res.json(data.ops[0]);  //frontendga yuboradi
    });
 });

 //DELETE
 app.post("/delete-item", (req, res) => {
   console.log("user entered / delete-item");
   const id = req.body.id;                   //qaysi item o‘chiriladi
   db.collection("plans").deleteOne(       //bitta o‘chiradi
      {_id: new mongodb.ObjectId(id) },
       function (err,data) {
         res.json({state: "success"});  //javob qaytaradi
   });
 });

//EDIT
 app.post("/edit-item", (req, res) => {
    console.log("user entered / edit-item");
   const data = req.body;
   console.log(data);
   db.collection("plans").findOneAndUpdate(     //update qiladi
      {_id:new mongodb.ObjectId(data.id) },  
      {$set: {reja: data.new_input } },      //yangi qiymat
      function (err, data) {
         res.json({state: "succses"});
      }
   );
 });

 app.get('/author', (req, res) => {  //'/author' http://localhost:3000/author
   res.render("author", {user: user });  //.res.render= HTML (EJS) sahifa chiqaradi
 });


 app.post("/delete-all", (req, res) => { 
    console.log("user entered / delete-all-item");
   if (req.body.delete_all) {
      db.collection("plans").deleteMany(function () {
         res.json({ state: "hamma rejalar ochirildi"});
      });
   }
 });

 app.get("/", function (req, res) {      // GET request (asosiy sahifa) http://localhost:3000
   console.log('foydalanuvchi kiitdi /');
     console.log('STEP2 BACKEND');

     console.log('STEP3 BACKEND => DB');
   db.collection("plans")
   .find()  //ma’lumotlarni qidiradi / oladi
   .toArray((err, data) => {
       console.log('STEP4 DB => BACKEND');
       console.log('STEP5 BACKEND =>FrontEnd');
         res.render("reja", { items: data });     //EJS(data) .HTML’ni browserga yuboradi
   });
 });

module.exports = app;
