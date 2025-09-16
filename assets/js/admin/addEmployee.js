
let managerName = "";
let location_select = "";
let ColonyName = "";
function e_colonyName(){
    ColonyName =  document.getElementById("e_colony").value
    console.log(ColonyName)
 }

function addEmployee(){
   let Name = document.getElementById("e_name").value
   let Contact =  document.getElementById("e_number").value
   // let Email_Id =  document.getElementById("e_email").value
   let Designation =  document.getElementById("e_designation").value
   let DEPT =  document.getElementById("e_depart").value
   let Qr =  document.getElementById("e_qr").value
   let AREA =  document.getElementById("e_area").value
//    let COLONY =  document.getElementById("e_colony").value
   let EIS =  document.getElementById("e_eis").value

 console.log(name , Number)
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
        EIS:EIS,
        Name:Name,
        Contact:Contact,
        Designation:Designation,
        DEPT:DEPT,
        Qr:Qr,
        AREA:AREA,
        COLONY:ColonyName,
        Date:date,
    };
    console.log(jsonData)
   //  if(EIS && Name && Contact && ColonyName){
       fetch(employee_api, {
         method: "POST",
         body: JSON.stringify(jsonData),
         headers: {
           "Content-Type": "application/json ",
         },
       }).then((res) => {
         if (res.status === 402) {
           window.location = "../../../index.html";
         }
         alert("successsfully Employee Generated");
         location.reload();
       });
   // }
}


