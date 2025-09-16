let user = JSON.parse(localStorage.getItem("user"));
let managerName = "";
let location_select = "";
area = user.Area;
category = user.Category;
managerName = user.Name;

document.getElementById(
  "location"
).innerHTML = ` <input class="form-control" value="${area}" id="location_select" type="text" placeholder="Please Enter Email ID"
         required="required" readonly>`;

// let location_select = "";
function addTechnician() {
  let name = document.getElementById("techName").value;
  let email = document.getElementById("emailId").value;
  let Contact = document.getElementById("contact").value;
  let Employee_ID = document.getElementById("EmployeID").value;
  // const result1 = new Date().toLocaleDateString('en-GB');

  // date and time
  var currentdate = new Date();
  var month = +currentdate.getMonth() + 1;
  var datetime =
    currentdate.getDate() +
    "/" +
    month +
    "/" +
    currentdate.getFullYear() +
    "  " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  const myArray = datetime.split("  ");
  date = myArray[0];
  time = myArray[1];

  console.log(date, time);

  let jsonData = {
    Name: name,
    Contact: Contact,
    Email_Id: email,
    Location: area,
    Employee_Id: Employee_ID,
    Date: date,
    Category: category,
    Time: time,
    Manager_Name: managerName,
    Total_complaints: 0,
    Open_complaints: 0,
    Close_complaints: 0,
  };
  fetch(addTech_api, {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-Type": "application/json ",
    },
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    alert("successsfully complain generated");
    // location.reload();
    // window.location.href = "./complaintCreate.html"
  });
}

function locationSelect() {
  let departmentValue = document.getElementById("location_select").value;
  location_select = departmentValue;
  //    console.log(location_select + " department value")
}
