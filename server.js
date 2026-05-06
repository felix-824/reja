const http = require('http');   //HTTP server yaratish
const mongodb = require("mongodb");  //MongoDB bilan ulanish uchun kutibxona

let db; //database ni saqlash uchun variable
const connectionString = "mongodb+srv://nf94new:4bG7t7Epim7OWwOR@cluster0.rtpua.mongodb.net/Reja";  //MongoDB ga ulanish manzili (link)


mongodb.connect(connectionString, {   //MongoDB ga ulanish funksiyasi
    useNewUrlParser: true,
    useUnifiedTopology: true,
 }, (err, client) => {
     if(err) console.log("ERROR on connection MongoDb");
     else {
    console.log("MongoDB connection succeed");
     module.exports = client;                //boshqa fayl (app.js) DB ni ishlatishi uchun export qiladi
    const app = require("./app");           //app.js dagi express serverni olib keladi
    const server = http.createServer(app);  //server yaratadi
    let PORT = 3000;                        //server ishlaydigan port
    server.listen(PORT, function () {   //server.listen =serverni ishga tushiradi  /function () {} = server ishga tushganda ishlaydi
        console.log(
    `The server is running successfully on port ${PORT}, http://localhost:${PORT}`); 
});
     }
  });
 
