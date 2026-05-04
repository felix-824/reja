// const { response } = require("express");

console.log("FrontEnd JS ishga tushdi");

function itemTemplate(item) {
    return` <li 
           class="list-group-item list-group-item-info d-flex aligin-items-center justify-content-between">
        <span class="item-text">${item.reja}</span>
        <div>
          <button 
            data-id="${item._id}" 
            class="edit-me btn btn-secondary btn-sm mr-1"
            >
            Ozgartirish
          </button>
          <button 
            data-id="${item._id}" 
          class="delete-me btn btn-danger btn-sm">
          Ochirish</button>
        </div>
        </li>`;
}

let createField = document.getElementById("create-field");  //HTML elementni topadi inputni

document.getElementById("create-form").addEventListener("submit", function (e) {
  e.preventDefault();  //form default yuborilishini to‘xtatadi

   axios
   .post("/create-item", {reja: createField.value })
   .then((response) => {    //serverdan javob kelganda ishlaydi
     document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data)) //serverdan kelgan data → HTMLga aylantiriladi
     createField.value = "";  //inputni tozalaydi
     createField.focus();     //cursorni qaytarad
   })
   .catch((err) => {
    console.log("Iltimos qaytadan harakat qiling");
   });
});

document.addEventListener("click", function (e) {  //butun sahifadagi clickni eshitadi
    //delete oper
    console.log(e.target);
    if (e.target.classList.contains("delete-me")) {    //bosilgan elementda delete-me class bormi?
      if (confirm("Aniq ochirmoqchimisiz")) {
        axios
        .post("/delete-item", {id: e.target.getAttribute("data-id") })
        .then((respose) => {
           console.log(respose.data);
           e.target.parentElement.parentElement.remove(); 
        })
        .catch(() => {
              console.log("Iltimos qaytadan harakat qiling");
        });
      }
    }

    //edit oper
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt("o'zgartrish kiriting",
       e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
      );
    if (userInput) {
     axios.
     post("/edit-item", {
      id: e.target.getAttribute("data-id"),
       new_input: userInput,
      }).then(response => {
        console.log(response.data);
        e.target.parentElement.parentElement.querySelector(
          ".item-text"
        ).innerHTML = userInput;
      })
      .catch(err => {
         console.log("Iltimos qaytadan harakat qiling");
      });
    }
  }

});


document.getElementById("clean-all").addEventListener("click", function() {
  axios.post("/delete-all", {delete_all: true}).then(respose => {
   alert(respose.data.state);
   document.location.reload();
  });
});
