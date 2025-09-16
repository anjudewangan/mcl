let updateId = JSON.parse(localStorage.getItem("updateMan"))

let managerName = "";
let location_select = "";
let ColonyName = "";
let category = "";

fetch(`${excalated_matrix_api}/${updateId}`)
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then((value) => {
    let editData = "";
    editData = `
             <div class="col-md-6 mb-3">
             <label class="control-label">Name</label>
             <input class="form-control" id="m_name" value="${value.Name}" type="text" placeholder="name"
                 required="required">
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please select a valid name.
             </div>
         </div>
         <div class="col-md-6 mb-3">
             <label class="control-label">Contact No.</label>
             <input class="form-control" id="m_number" value="${value.Contact}" type="number" placeholder="Contact" required="required" >

             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please select a valid contact no..
             </div>
         </div>
     </div>
     <div class="row g-3">
         <div class="col-md-6">
             <label class="control-label">UserID</label>
             <input class="form-control" id="m_userId" type="text"
                 placeholder="UserID" value="${value.UserID}" required="required" readonly>
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please provide a valid user id.
             </div>
         </div>
         <div class="col-md-6 mb-3">
             <label class="control-label">Password</label>
             <input class="form-control" value="${value.Password}" id="m_password" type="text"
                 placeholder="Password" required="required" readonly>
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please provide a valid  password.
             </div>
         </div>
     </div> 
     <div class="row gy-3 ">
         <div class="col-md-6">
             <label class="control-label">Category</label>
             <select class="form-select" id="m_category" value="${value.Category}" onchange="categoryName()" aria-label="Default select example"
             required="required">
             <option selected value="${value.Category}">${value.Category}</option>
             <option>CIVIL</option>
             <option>ELECTRICAL</option>
             <option>TELECOM</option>
         </select>
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please provide a valid Category.
             </div>
         </div>
         <div class="col-md-6 mb-3">
             <label class="control-label">Designation</label>
             <input class="form-control" value="${value.Designation}" id="m_designation" type="text"
                 placeholder="Designation" required="required">
             <div class="valid-feedback">
                 Looks good!
             </div>
             <div class="invalid-feedback">
                 Please provide a valid email id .
             </div>
         </div>
     </div>  
         <div class="row g-2">
             <div class="col-md-6">
                 <label class="control-label">Level</label>
                 <input class="form-control" value="${value.Level}" id="m_level" type="text" placeholder="Level"
                     required="required">
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please provide a valid level.
                 </div>
             </div>
             <div class="col-md-6">
                 <label class="control-label">Colony</label>
                 <select class="form-select" id="m_colony" value="${value.Area}" onchange="colonyName()" aria-label="Default select example"
                     required="required">
                     <option selected value="${value.Area}">${value.Area}</option>
                     <option>Jagruti Vihar Colony</option>
                     <option>RAMPUR</option>
                     <option>IB-Valley Lajkura OCP</option>
                     <option>Lakhanpur Area</option>
                     <option>Hingula OCP</option>
                     <option>Basundhra</option>
                     <option>CWS IB VALLEY</option>
                     <option>Ananta OCP</option>
                     <option>GM Orient Area</option>
                     <option>Jagannath OCP</option>
                     <option>IB-Valley GM Area Unit</option>
                     <option>TALCHER COLLIERY</option>
                     <option>Talcher GM Office</option>
                     <option>CWS(X) TALCHER</option>
                     <option>IB-Valley Samaleshwari OCP</option>
                     <option>Anand Vihar Colony</option>
                     <option>Balram OCP</option>
                     <option>BHARATPUR OCP</option>
                     <option>GM OFFICE(JAGANNATH AREA)</option>
                     <option>LINGARAJ OCP</option>
                     <option>NSCH Colony</option>
                     <option>ORIENT SUBAREA</option>
                     <option>NANDIRA COLLIERY</option>
                 </select>
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please provide a valid colony.
                 </div>
             </div>
             `;
    document.getElementById("editManagerData").innerHTML = editData;
  });

function colonyName() {
  ColonyName = document.getElementById("m_colony").value;
}

function categoryName() {
  category = document.getElementById("m_category").value;
}

function editManager() {
  let name = document.getElementById("m_name").value;
  let Number = document.getElementById("m_number").value;
  let designation = document.getElementById("m_designation").value;
  let level = document.getElementById("m_level").value;

  if (ColonyName == "" || category == "") {
    colonyName();
    categoryName();
  }

  let jsonData = {
    Name: name,
    Contact: Number,
    Area: ColonyName,
    Level: level,
    Category: category,
    Designation: designation,
  };
  fetch(`${excalated_matrix_api}/${updateId}`, {
    method: "PATCH",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-type": "application/json",
    },
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    alert("successfully Manager updated");
    location.reload();
  });
}