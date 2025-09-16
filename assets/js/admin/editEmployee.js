let updateIndexValue = JSON.parse(localStorage.getItem("updateMan"));

let managerName = "";
let location_select = "";
let ColonyName = "";
function e_colonyName() {
  ColonyName = document.getElementById("e_colony").value;
  console.log(ColonyName);
}

fetch(employee_api)
  .then((res) => {
    if (res.status === 402) {
      window.localStorage = "../../../index.html";
    }
    return res.json();
  })
  .then((data) => {
    let employeeData = "";
    data.map((value, index) => {
      if (index == updateIndexValue) {
        return (employeeData = `
              <div class="col-md-6">
             <label class="control-label">EIS No.</label>
             <input class="form-control" id="e_eis" type="text"
                 placeholder="EIS Number" value="${value.EIS}"  required="required" readonly >
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please select a valid user type.
             </div>
         </div> 
         <div class="col-md-6">
             <label class="control-label">Name</label>
             <input class="form-control" id="e_name" value="${value.Name}" type="text" placeholder="Name"
                 required="required">
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please select a valid Name.
             </div>
         </div>
     </div>
     <div class="row gy-3 mb-3">
         <div class="col-md-6">
             <label class="control-label">Colony</label>
             <select class="form-select" id="e_colony" value="${value.COLONY}" onchange="e_colonyName()" aria-label="Default select example"
                 required="required">
                 <option selected disabled  value="${value.COLONY}">${value.COLONY}</option>
                 <option>${value.COLONY}</option>
                 <option>Jagruti Vihar Colony </option>
                 <option>RAMPUR </option>
                 <option>IB-Valley Lajkura OCP </option>
                 <option>Lakhanpur Area </option>
                 <option>Hingula OCP </option>
                 <option>Basundhra </option>
                 <option>CWS IB VALLEY </option>
                 <option>Ananta OCP </option>
                 <option>GM Orient Area  </option>
                 <option>Jagannath OCP </option>
                 <option>IB-Valley GM Area Unit </option>
                 <option>TALCHER COLLIERY </option>
                 <option>Talcher GM Office </option>
                 <option>CWS(X) TALCHER </option>
                 <option>IB-Valley Samaleshwari OCP </option>
                 <option>Anand Vihar Colony </option>
                 <option>Balram OCP </option>
                 <option>BHARATPUR OCP </option>
                 <option>GM OFFICE(JAGANNATH AREA) </option>
                 <option>LINGARAJ OCP </option>
                 <option>NSCH Colony </option>
                 <option>ORIENT SUBAREA </option>
                 <option>NANDIRA COLLIERY </option>
             </select>
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please select a valid user type.
             </div>
         </div>
         <div class="col-md-6">
             <label class="control-label">Area</label>
             <input class="form-control" id="e_area" value="${value.AREA}" type="text" placeholder="Area"
                 required="required">
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please select a valid Name.
             </div>
         </div>
     </div>
     <div class="row gy-3 mb-3">
         <div class="col-md-6">
             <label class="control-label">Designation</label>
             <input class="form-control" id="e_designation" value="${value.Designation}" type="text"
                 placeholder="Designation">
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please provide a valid designation.
             </div>
         </div>
         <div class="col-md-6">
             <label class="control-label">Mobile Number</label>
             <input class="form-control" value="${value.Contact}" id="e_number" type="number"
                 placeholder="Mobile Number" >
         </div>
     </div>
     <div class="row gy-3 mb-3">
         <div class="col-md-6">
             <label class="control-label">Department</label>
             <input class="form-control" id="e_depart" type="text"
                 placeholder="Department" value="${value.DEPT}" required="required">
            
         </div>
         <div class="col-md-6">
             <label class="control-label">Quarter No.</label>
             <input class="form-control" id="e_qr" type="text"
                 placeholder="Quarter No." value="${value.Qr}" required="required">
            
         </div>
    
             `);
      }
    });
    document.getElementById("editEmployee").innerHTML = employeeData;
  });

function editEmployee() {
  let Name = document.getElementById("e_name").value;
  let Contact = document.getElementById("e_number").value;
  let Designation = document.getElementById("e_designation").value;
  let DEPT = document.getElementById("e_depart").value;
  let Qr = document.getElementById("e_qr").value;
  let AREA = document.getElementById("e_area").value;

  //  console.log(name , Number )
  // date and time
  var currentdate = new Date();
  var datetime =
    currentdate.getDay() +
    "/" +
    currentdate.getMonth() +
    "/" +
    currentdate.getFullYear() +
    "  " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  // console.log(datetime)
  var dateTime = new Date(datetime).toLocaleString(undefined, {
    timeZone: "Asia/Kolkata",
  });
  // console.log(dateTime)

  if (ColonyName == "") {
    e_colonyName();
  }

  const myArray = dateTime.split(", ");
  let date = myArray[0];
  let jsonData = {
    Name: Name,
    Contact: Contact,
    Designation: Designation,
    DEPT: DEPT,
    Qr: Qr,
    AREA: AREA,
    COLONY: ColonyName,
    Date: date,
  };

  fetch(employee_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      data.map((value, index) => {
        if (index == updateIndexValue) {
          //sending eis as id for server
          path2show = employee_api + "/" + `${value.EIS}`;
          console.log(jsonData);
          fetch(path2show, {
            method: "PATCH",
            body: JSON.stringify(jsonData),
            headers: {
              "Content-type": "application/json",
            },
          }).then((res) => {
            if (res.status === 402) {
              window.location = "../../../index.html";
            }
            alert("successfully updated");
            location.reload();
          });
        }
      });
    });
}
