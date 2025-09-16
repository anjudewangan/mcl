// console.log("Hello world");
let user = JSON.parse(localStorage.getItem("user"));

// console.log(user)
let optionShow = {};
let dataObject = {};
let civilData = "";
let subOption = "";
let complain = "";
let work = "";
let overseers = "";

const e_name = user.Name;
console.log("🚀 ~ file: newComplain.js:14 ~ e_name:", e_name);
const e_EIS = user.EIS;
const e_QR = user.Qr;
const e_colony = user.COLONY;
const e_area = user.AREA;
const e_dept = user.DEPT;
const e_contact = user.Contact;
const e_design = user.Designation;

let departmentValue = document.getElementById("department");

function departments() {
  // console.log(calue)
  // console.log("Hello department");
  let departmentValue = document.getElementById("department").value;
  civilData = departmentValue;
  //  console.log(civilData);
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
  // console.log(departmentValue + " department value")
  let optionValue = "";
  if (departmentValue == "Other") {
    document.getElementById("selectDefault").style.display = "none";
    document.getElementById("other").style.display = "block";
    optionValue = `         
              <input class="form-control" type="text" onchange="civilOptions()"  id="works" placeholder="Write complain"
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
    if (response.status === 402) {
      window.location = "../../../index.html";
    }
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
  // console.log(departmentValue + " department value")
  work = departmentValue;
}

let time = "";
let date = "";
let complaint_data;
let dataValue;
let complainNumber1 = "";
let complainNumber2 = "";
let monthValue;
let numberData;
let lastNum = 0;
function get_serial_count() {
  return new Promise((resolve, reject) => {
    fetch(`${pagination_api}`)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        complaint_data = +data[0].totalCount[0].count + 10000;

        const result1 = new Date().toLocaleDateString("en-GB");
        let year = result1.split("/");
        complainNumber1 = year[1];
        complainNumber2 = year[2];
        resolve();
      })
      .catch((error) => reject(error));
  });
}
// new compalin generated

let form = document.getElementById("form");

function getISTTime() {
  var dateUTC = new Date(Date.now());
  var dateUTC = dateUTC.getTime();
  var dateIST = new Date(dateUTC);
  return dateIST.toString();
}

const submitData = async (e) => {
  e.preventDefault();
  if (work == false) {
    let departmentValue = document.getElementById("works").value;
    work = departmentValue;
    // console.log(work);
  }
  await get_serial_count();
  const manager = await showOption(e_colony, civilData);
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
  // console.log("submit button");
  let OverseersName = "";
  let civilValue = civilData.toLocaleUpperCase();
  complain = document.getElementById("complaintData").value;
  if (complain === "") {
    alert("please provide complain details.");
    return;
  }
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

  // console.log(value.Name);
  OverseersName = ` ${manager.Name} ${manager.Contact} `;
  let jsonData = {
    Complain_Number: complaint_datas,
    Ocupent_Name: e_name,
    EIS_No: e_EIS,
    Contact_Number: e_contact,
    Qr_No: e_QR,
    Work: work,
    Colony: e_colony,
    AREA: e_area,
    Active: true,
    Category: civilData,
    Sub_Category: subOption,
    Complain: complain,
    Overseers: OverseersName,
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

  let name = e_name;
  let ticketNo = `${complaint_datas}`;
  let ManagerTempId = "1007584332170766178";
  let OccupantTempId = "1007638184333964191";
  let OccupantMessage = `Dear ${name},
        Your complaint has been registered.
        Your ticket no. is ${ticketNo}.
        -From MCL7090 team (Patio Digital Private Limited)`;

  let ManagerMessage = `Dear Sir,\r\nA new ${civilData} work ticket has been raised with the ticket no.  ${ticketNo}.\r\nThank you.\r\n\r\nRegards,\r\nMCL7090 helpline. (PATIOD)`;
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

  console.log("Message Sent Successfully");
  // sendSMS(value.Contact,ManagerTempId,ManagerMessage);
  // sendSMS(e_contact,OccupantTempId,OccupantMessage);

  fetch(caller_api, {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-Type": "application/json ",
    },
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    sendSMS(manager.Contact, ManagerTempId, ManagerMessage);
    sendSMS(e_contact, OccupantTempId, OccupantMessage);
    alert("successsfully complaint generated");
    location.reload();
  });
};

function showOption(colony, category) {
  return new Promise((resolve, reject) => {
    fetch(
      `${baseUrl}/manager-details?&area=${colony}&category=${category.toUpperCase()}&level=1`
    )
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        resolve(data[0]);
      });
  });
}
form.addEventListener("submit", submitData);

fetch(`${baseUrl}/employee-complain?eis=${e_EIS}`)
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then((data) => {
    let count = 0;
    let complainData = "";
    data.map((value, index) => {
      count++;
      complainData += `<tr>
        <td>${count}</td>
        <td class='userList position-sticky start-0'><a key=${
          value._id
        } class="text-primary cursor-pointer"  data-bs-toggle="modal"
                 onclick="">${value.Complain_Number}</a></td>
        <td><span class="text-success f-w-700 f-12">${
          value.Inprogress[value.Inprogress.length - 1]
        }</span></td>
       </tr>`;
    });
    document.getElementById("complain_list").innerHTML = complainData;
    document.querySelectorAll(".userList").forEach((element) => {
      element.addEventListener("click", handleClickForUser);
    });
  });

const handleClickForUser = (e) => {
  showComplain(e.target.attributes.key.value);
};

function showComplain(indexValue) {
  $("#complaintPopup").modal("show");
  fetch(`${caller_api}/${indexValue}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
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
      document.getElementById("showData_user").innerHTML = complain_list;
    });
}
