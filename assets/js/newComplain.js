// console.log("Hello world");
let complaint_data;
let optionShow = {};
let dataObject = {};
let civilData = "";
let subOption = "";
let complain = "";
let work = "";
let overseers = "";
let complaintNumber;
let complain_obj;
let managerData;

function populate_EIS() {
  let eis_number = document.getElementById("EIS").value;
  complain_List(eis_number);
  fetch(`${baseUrl}/employee-detalis?eis=${eis_number}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../index.html";
      }
      return res.json();
    })
    .then((value) => {
      console.log(value);
      dataObject = value[0];
      value = value[0];
      objectData = `
           <div class="col-md-3">
                     <label class="control-label">PIS/EIS No.</label>
                    <input class="form-control"  id="EIS" type="text" value="${value.EIS}" onchange="populate_EIS()" placeholder="PIS/EIS No.">
                         <div class="valid-feedback">
                                   Looks good!
                    </div>
                 <div class="invalid-feedback">
                         Please provide a valid pis/eis No..
                     </div>
                 </div>
            <div class="row g-2" >
             <div class="col-md-6">
                 <label class="control-label">Area</label>
                 <input class="form-control" value="${value.AREA}" type="text" placeholder="Quarter No." readonly="readonly"
                 required="required">
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please select a valid area.
                 </div>
             </div>
             <div class="col-md-6 mb-3">
                 <label class="control-label">Colony</label>
                 <input class="form-control" value="${value.COLONY}" type="text" placeholder="Quarter No." readonly="readonly"
                 required="required">
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please select a valid colony.
                 </div>
             </div>
         </div>
         <div class="row g-3">
             <div class="col-md-3">
                 <label class="control-label">Quarter No.</label>
                 <input class="form-control" value="${value.Qr}" type="text" placeholder="Quarter No." readonly="readonly"
                     required="required">
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please provide a valid quarter no..
                 </div>
             </div>
             <div class="col-md-6 mb-3">
                 <label class="control-label">Designation</label>
                 <input class="form-control" value="${value.Designation}" type="text" placeholder="Quarter Address" readonly="readonly"
                     required="required">
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please provide a valid quarter address.
                 </div>
             </div>
         </div>
         <div class="row g-2">
             <div class="col-md-6">
                 <label class="control-label">Occupant Name</label>
                 <input class="form-control" type="text" value="${value.Name}" placeholder="Occupant Name" readonly="readonly"
                     required="required">
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please provide a valid occupant name.
                 </div>
             </div>
             <div class="col-md-6 mb-3">
                 <label class="control-label">Mobile Number</label>
                 <input class="form-control" type="number" value="${value.Contact}" placeholder="Mobile Number" readonly="readonly"
                     required="required">
                 <div class="valid-feedback">
                     Looks good!
                 </div>
                 <div class="invalid-feedback">
                     Please provide a valid mobile number.
                 </div>
              </div>
           </div>
             `;

      document.getElementById("showData").innerHTML = objectData;
    });
}

function complain_List(EIS_NO) {
  // console.log(EIS_NO);
  fetch(`${baseUrl}/employee-complain?eis=${EIS_NO}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      let count = 0;
      let complainData = "";
      data.map((value, index) => {
        count++;
        let complainTime = "";
        if (value.Complaint_Time !== "") {
          var dateUTC = new Date(value.Complaint_Time);
          complainTime = dateUTC.toLocaleTimeString();
        }
        complainData += `<tr>
        <td>${count}</td>
        <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${
          complainTime === "Invalid Date" ? "" : complainTime
        }</td>
        <td class='userList position-sticky start-0'><a key=${
          value._id
        } class="text-primary cursor-pointer"  data-bs-toggle="modal"
                 onclick="">${value.Complain_Number}</a></td>
        <td><span class="text-success f-w-700 f-12">${
          value.Inprogress[value.Inprogress.length - 1]
        }</span></td>
       </tr>`;
      });
      document.getElementById("emplyee_list").innerHTML = complainData;
      document.querySelectorAll(".userList").forEach((element) => {
        element.addEventListener("click", handleClickForUser);
      });
    });
}

const handleClickForUser = (e) => {
  showComplain(e.target.attributes.key.value);
};

function showComplain(indexValue) {
  $("#complaintPopup").modal("show");
  fetch(`${caller_api}/${indexValue}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../index.html";
      }
      return res.json();
    })
    .then((value) => {
      let complain_list = "";
      let complainTime = "";
      if (value.Complaint_Time !== "") {
        var dateUTC = new Date(value.Complaint_Time);
        complainTime = dateUTC.toLocaleTimeString();
      }
      let closeTime = "";
      if (value.Close_Time !== "") {
        var dateUTC = new Date(value.Close_Time);
        closeTime = dateUTC.toLocaleTimeString();
      }
      const lastIndexOfComplete = value.Inprogress.lastIndexOf("Complete");

      const statusClose = value.Inprogress.slice(-1)[0] === "Close";

      complain_list = `
            <div class="row">
              <div class="col-auto mb-3">
                  <p>Complaint no.:
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Complain_Number
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Registered date:
                      <u class="bg-light-info text-dark py-2 px-1">${new Date(
                        value.Complaint_Date
                      ).toLocaleDateString()} ${
        complainTime === "Invalid Date" ? "" : complainTime
      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Occupant name:
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Ocupent_Name
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Contact no :
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Contact_Number
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>QTR no.:
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Qr_No
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Colony :
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Colony
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Area:
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.AREA
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>EIS/PIS no :
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.EIS_No
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Complaint Category:
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Sub_Category
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Complaint Details:
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Complain
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Department
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Category
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Technician Name
                      <u class="bg-light-info text-dark py-2 px-1">${
                        value.Technician_Name
                      }</u>
                  </p>
              </div>
              <div class="col-auto mb-3">
                  <p>Status:
                      <span class="text-primary">${value.Inprogress.slice(
                        -1
                      )}</span>
                  </p>
              </div>
              <div class="mb-3">
                  <div class="card card-timeline border-none">
                      <ul class="bs4-order-tracking">
                          <li class="step">
                              <div class="bg-primary mb-1">Open</div> <span
                                  class="text-primary">${new Date(
                                    value.Complaint_Date
                                  ).toLocaleDateString()} ${
        complainTime === "Invalid Date" ? "" : complainTime
      }</span>
                          </li>
                          <li class="step">
                              <div class="bg-warning mb-1">Progress</div> <span
                                  class="text-primary">${value.Inprogress.slice(
                                    -1
                                  )}</span>
                          </li>
                          ${
                            lastIndexOfComplete !== -1
                              ? `<li class="step">
                              <div class="bg-info mb-1">Complete</div> <span
                              class="badge-info">${value.CompleteDate.slice(
                                -1
                              )} ${value.CompleteTime.slice(-1)}</span>
                          </li>`
                              : ""
                          }
                          ${
                            statusClose
                              ? `<li class="step">
                              <div class="bg-success mb-1">Close</div> <span
                                  class="text-success">${value.Feedback_date.slice(
                                    -1
                                  )}  ${
                                  closeTime === "Invalid " ? "" : closeTime
                                }</span>
                          </li>`
                              : ""
                          }
                          
                      </ul>
                  </div>
              </div>
          </div>
                        `;
      document.getElementById("showComplains").innerHTML = complain_list;
    });
}

let departmentValue = document.getElementById("department");

function departments() {
  // console.log(calue)
  // console.log("Hello department");
  let departmentValue = document.getElementById("department").value;
  civilData = departmentValue;
  let optionValue = "";
  if (departmentValue == "Civil") {
    optionValue = `<option selected  value="">Select Job Type
                        </option>
                        <option>Sanitary/Plumbing Works</option>
                        <option>Carpentry Works</option>
                        <option>Mason Work</option>
                        <option>Welding Work</option>
                        <option>Other</option>
                     
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please select a valid job type.
                    </div>
         
        `;
    document.getElementById("options").innerHTML = optionValue;
  } else if (departmentValue == "Electrical") {
    optionValue = `
        <label class="control-label" for="">Sub Category</label>
                    <select class="form-select" aria-label="Default select example"
                        required="required" id="options">
                        <option selected disabled value="">Select Job Type
                        </option>
                        <option>Electrical Works</option>
                        <option>Other</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please select a valid job type.
                    </div>
         
        `;
    document.getElementById("options").innerHTML = optionValue;
  } else if (departmentValue == "Telecom") {
    optionValue = `
        <label class="control-label" for="">Sub Category</label>
                    <select class="form-select" aria-label="Default select example"
                        required="required" id="options">
                        <option selected disabled value="">Select Job Type
                        </option>
                        <option>Telecom not working</option>
                        <option>Dish TV</option>
                    </select>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please select a valid job type.
                    </div>
         
        `;
    document.getElementById("options").innerHTML = optionValue;
  }
}

async function civilOption() {
  // console.log("Rajtilak patel sirri")
  //   console.log("sub Category")
  let departmentValue = document.getElementById("options").value;
  subOption = departmentValue;
  // console.log(departmentValue + " department value");
  let optionValue = "";
  if (departmentValue == "Other") {
    document.getElementById("selectDefault").style.display = "none";
    document.getElementById("other").style.display = "block";
    optionValue = `         
              <input class="form-control otherValue" type="text" onchange="civilOptions()"  id="works" placeholder="Write complain"
                required="required">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please select a valid job type.
                    </div>
         
        `;
    document.getElementById("other").innerHTML = optionValue;
  } else {
    const response = await fetch(jobs_api, {
      method: "POST",
      body: JSON.stringify({
        filter: "subcategory",
        value: departmentValue,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    optionValue = `<option selected  value="">Select Job Type </option>`;
    data.map((option) => {
      optionValue += `<option key=${option._id} >${option.name}</option>`;
    });
    document.getElementById("work").innerHTML = optionValue;
  }
}

function civilOptions() {
  // console.log("Rajtilak patel sirri")
  // console.log("sub Category")
  let departmentValue = document.getElementById("work").value;
  console.log(departmentValue + " from civilOptions");
  work = departmentValue;
}

// const result1 = new Date().toLocaleDateString('en-GB');
// console.log(result1); // 👉️ 24/02/2023
let form = document.getElementById("form");

const submitData = async (e) => {
  e.preventDefault();
  document.getElementById("submitButton").disabled = true;
  const managerData = await showOption(dataObject.COLONY, civilData);

  await escalation(managerData);

  complain = document.getElementById("complaintData").value;
  if (work === false) {
    let departmentValue = document.getElementById("works").value;

    work = departmentValue;
  }
  // console.log(work)
  if (complain) {
    newComplaint();
  }
};

form.addEventListener("submit", submitData);

let occupantNumber;
let time = "";
let date = "";

let dataValue;
let complainNumber1 = "";
let complainNumber2 = "";
let monthValue;
let numberData;
let lastNum = 0;
let lastNum1 = 0;
const result1 = new Date().toLocaleDateString("en-GB");
let year = result1.split("/");
complainNumber1 = year[1];
complainNumber2 = year[2];
//  })

function getISTTime() {
  var dateUTC = new Date(Date.now());
  var dateUTC = dateUTC.getTime();
  var dateIST = new Date(dateUTC);
  return dateIST.toString();
}

let employeeNumber;
function newComplaint() {
  console.log("value of overseeres", { overseers });
  if (overseers === "") {
    alert("Please select overseers from the list");
    return;
  }
  employeeNumber = dataObject.Contact;
  let jsonData = {
    Complain_Number: complaintNumber,
    Ocupent_Name: dataObject.Name,
    EIS_No: dataObject.EIS,
    Contact_Number: dataObject.Contact,
    Qr_No: dataObject.Qr,
    Work: work,
    Colony: dataObject.COLONY,
    AREA: dataObject.AREA,
    Active: true,
    Category: civilData,
    Sub_Category: subOption,
    Complain: complain,
    Overseers: overseers,
    Overseers_Number: overseers,
    Complaint_Date: getISTTime(),
    Complaint_Time: getISTTime(),
    Technician_Name: "",
    Technician_Number: "",
    InprogressTime: "",
    InprogressRemarks: "",
    CompleteRemarks: "",
    CompleteTime: "",
    Completion_of_work: "",
    Completed_in_time: "",
    Complaint_resolve: "",
    Overseers_curstomer_rating: "",
    Call_customer_rating: "",
    Queries: "",
    Message_to_occupent: true,
    Message_to_Manager: true,
    Close_Time: "",
  };

  fetch(caller_api, {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-Type": "application/json ",
    },
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../index.html";
    }
    res.json().then((data) => {
      sendSMS(ManagerNumber, ManagerTempId, managerTemplate);
      sendSMS(employeeNumber, OccupantTempId, OccupantMessage);
      showModel(data);
    });
    // alert("Complaint Successsfully Registered!");
  });

  let name = dataObject.Name;
  let ticketNo = complaintNumber;
  let ManagerTempId = "1007584332170766178";
  let OccupantTempId = "1007638184333964191";
  let OccupantMessage = `Dear ${name},
Your complaint has been registered.
Your ticket no. is ${ticketNo}.
-From MCL7090 team (Patio Digital Private Limited)`;

  let managerTemplate = `Dear Sir,\r\nA new ${civilData} work ticket has been raised with the ticket no.  ${ticketNo}.\r\nThank you.\r\n\r\nRegards,\r\nMCL7090 helpline. (PATIOD)`;

  // let manager = `https://www.txtguru.in/imobile/api.php?username=patiodigital.com&password=29000803&source=PATIOD&dmobile=9131167997,${ManagerNumber}&dlttempid=${ManagerTempId}&message=${ManagerMessage}`

  //   let Occupant = `https://www.txtguru.in/imobile/api.php?username=patiodigital.com&password=29000803&source=PATIOD&dmobile=919107999999,${dataObject.Contact}&dlttempid=${OccupantTempId}&message=${OccupantMessage}`

  function sendSMS(contactnumber, templateId, smstext) {
    fetch("/send-complaint-msg", {
      method: "POST",
      body: JSON.stringify({
        templateId,
        msg: encodeURIComponent(smstext),
        mobile: contactnumber,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

function showOption(colony, civilData) {
  return new Promise((resolve, reject) => {
    fetch(
      `${baseUrl}/manager-details?&area=${colony}&category=${civilData.toUpperCase()}&level=1`
    )
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        resolve(data[0]);
      });
  });
}

function escalation(managerData) {
  const promise = new Promise((resolve, reject) => {
    fetch(`${pagination_api}`)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        complaint_data = +data[0].totalCount[0].count + 10000;
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

        // console.log("last number"+lastNum)
        let complaint_datas = "";
        if (civilData == "Civil") {
          complaint_data++;
          complaint_datas =
            "C/" + complainNumber1 + complainNumber2 + "/" + complaint_data;
        } else if (civilData == "Telecom") {
          complaint_data++;
          complaint_datas =
            "T/" + complainNumber1 + complainNumber2 + "/" + complaint_data;
        } else if (civilData == "Electrical") {
          complaint_data++;
          complaint_datas =
            "E/" + complainNumber1 + complainNumber2 + "/" + complaint_data;
        }
        complaintNumber = complaint_datas;
        ManagerNumber = managerData.Contact;
        overseers = `${managerData.Name} ${managerData.Contact}`;
        resolve();
      });
  });
  return promise;
}

function showModel(data) {
  const showData = ` <div class="mb-3 para-confirm mt-3">
                 <h5 class="mb-3">Occupant Message :</h5>Dear ,
                 <p>Complaint no. <u class="bg-light-info text-dark py-2 px-1">${data.Complain_Number}</u>
                     registered dtd. <u class="bg-light-info text-dark py-2 px-1">${data.Complaint_Date}</u> QTR
                     no. <u class="bg-light-info text-dark py-2 px-1">${data.Qr_No}</u> Colony <u
                         class="bg-light-info text-dark py-2 px-1">${data.Colony}</u> Area <u
                         class="bg-light-info text-dark py-2 px-1">${data.AREA}</u> Complaint
                     Category <u class="bg-light-info text-dark py-2 px-1">${data.Category}</u> From MCL.
                     </p>
             </div>
             <div class="mb-3 para-confirm">
                 <h5 class="mb-3">Manager (L1)</h5> Dear,
                 <p>Complaint no. <u class="bg-light-info text-dark py-2 px-1">${data.Complain_Number}</u>
                     registered dtd. <u class="bg-light-info text-dark py-2 px-1">${data.Complaint_Date}</u> QTR
                     no. <u class="bg-light-info text-dark py-2 px-1">${data.Qr_No}</u> Colony <u
                         class="bg-light-info text-dark py-2 px-1">${data.Colony}</u> Area <u
                         class="bg-light-info text-dark py-2 px-1"> ${data.AREA}</u> EIS/PIS no
                   <u class="bg-light-info text-dark py-2 px-1">${data.EIS_No}</u> Contact no <u
                         class="bg-light-info text-dark py-2 px-1">${data.Contact_Number}</u> Complaint Category
                     <u class="bg-light-info text-dark py-2 px-1">${data.Sub_Category}</u>Department <u
                         class="bg-light-info text-dark py-2 px-1">${data.Category}</u> From MCL.
                 </p>
             </div>
             <div class="mb-3">
                 Overseers<u class="bg-light-info text-dark py-2 px-1">${data.Overseers}</u>
             </div>
         </div>
         <div class="modal-footer d-flex justify-content-between">
             <button type="button" class="btn btn-primary" onclick="closeModel()">Done</button>
         </div>
     </div>`;
  document.getElementById("confirmBox").innerHTML = showData;
  $("#confirmPopup").modal("show");
}
function closeModel() {
  window.location.href = "./complaintCreate.html";
}
