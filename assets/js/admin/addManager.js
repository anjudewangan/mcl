
let managerName = "";
let location_select = "";
let ColonyName = "";
let category = "";
function colonyName(){
   ColonyName =  document.getElementById("m_colony").value
   console.log(ColonyName)
}

function categoryName(){
    category =  document.getElementById("m_category").value
    console.log(category)
 }

function addManager(){
   let name = document.getElementById("m_name").value
   let userId =  document.getElementById("m_userId").value
   let Password =  document.getElementById("m_password").value
   let Number =  +document.getElementById("m_number").value
   let Email =  document.getElementById("m_email").value
//    let category =  document.getElementById("m_category").value
//    let area =  document.getElementById("m_area").value
   let designation =  document.getElementById("m_designation").value
   let level =  +document.getElementById("m_level").value
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
        Name:name,
        Contact:Number,
        Email_Id:Email,
        Area:ColonyName,
        UserID:userId,
        Password:Password,
        Level:level,
        Category:category,
        Designation:designation,
        Date:date
    };
     console.log(jsonData)
    if(userId && Password && level &&  name && Number && category ){
       fetch(excalated_matrix_api, {
         method: "POST",
         body: JSON.stringify(jsonData),
         headers: {
           "Content-Type": "application/json ",
         },
       }).then((res) => {
         if (res.status === 402) {
           window.location = "../../../index.html";
         }
         alert("successsfully Manager Generated");
         location.reload();
       });
  }
}



