
let managerName = "";
let location_select = "";

function addCaller(){
   let name = document.getElementById("c_name").value
   let Password =  document.getElementById("c_password").value
   let Number =  document.getElementById("c_number").value
   let Email =  document.getElementById("c_email").value

 console.log(name , Password , Number , Email)
    // date and time 
    var currentdate = new Date();
    var datetime = currentdate.getDay() + "/" + currentdate.getMonth() + "/" + currentdate.getFullYear() + "  " + currentdate.getHours() + ":" 
    + currentdate.getMinutes() + ":" + currentdate.getSeconds();
    // console.log(datetime)
    var dateTime = new Date(datetime).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
    // console.log(dateTime)

    const myArray = dateTime.split(", ")
    let date = myArray[0]
     let jsonData = {
        UserName:name,
        Password:Password,
        Contact:Number,
        Email_Id: Email,
        Date:date,
       
    };
       fetch(caller_data_api, {
         method: "POST",
         body: JSON.stringify(jsonData),
         headers: {
           "Content-Type": "application/json ",
         },
       }).then((res) => {
         if (res.status === 402) {
           window.location = "../../../index.html";
         }
         alert("successsfully Caller Generated");
         location.reload();
       });
}



