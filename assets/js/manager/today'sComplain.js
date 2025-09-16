// console.log("manager list");
let progressData = null;
let Inprogress = "";
user = JSON.parse(localStorage.getItem("user"));
let managerData = [];
let complain_length = 0;
const pageSize = 10;
let progressStatus = null;
let searchParam = null;

area = user.Area;
category = user.Category;
category = category.charAt(0) + category.slice(1).toLowerCase();
managerName = user.Name;

const handleClickForUser = (e) => {
  showComplain(e.target.attributes.key.value);
};

const handleFeedbackClick = (e) => {
  feedback(e.target.attributes.key.value);
};

const handleTechnicianAssign = (e) => {
  userSelect(e.target.attributes.key.value);
};

const handleProgressUpdate = (e) => {
  progress(e.target.attributes.key.value);
};

let userAssing = "";
let indexValue = "";
function userSelect(indexData) {
  // console.log(indexData)
  indexValue = indexData;
  fetch(addTech_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      let addTech = `<option selected disabled value="">Select Technician Name
                        </option>`;
      data.map((value) => {
        // console.log(value)
        if (value.Location === area && value.Category === user.Category) {
          addTech += `
               <option>${value.Name}</option>
              `;
        }
        document.getElementById("userOption").innerHTML = addTech;
      });
    });
}

//  update button click :- feedback part
let caller_index = 0;
function update_Status(index) {
  caller_index = index;
  $("#updateProcessPopup").modal("show");

  const dataValue = `
        <div class="row">
            <label for="" class="form-label">Is the complaint resolved?</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions3"
                id="inlineRadio5" value="Fully Resolved" checked>
            <label class="form-check-label" for="inlineRadio5">Fully Resolved</label>
        </div>
        <!--<div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions3"
                id="inlineRadio6" value="Partially Resolved">
            <label class="form-check-label" for="inlineRadio6">Partially Resolved</label>
        </div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="inlineRadioOptions3"
                id="inlineRadio7" value="Not Resolved">
            <label class="form-check-label" for="inlineRadio7">Not Resolved</label>
        </div> -->
        
        <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="radio" name="inlineRadioOptions3"
            id="inlineRadio7" value="Re-Open">
        <label class="form-check-label" for="inlineRadio7">Re Open</label>
        
       </div>
       <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="inlineRadioOptions3"
            id="inlineRadio5" value="Other Reason" checked>
        <label class="form-check-label" for="inlineRadio5">Other Reason</label>
    </div>
        <div class="row">
            <label for="" class="form-label">Customer rating on overseer work</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions4"
                id="inlineRadio8" value="Poor">
            <label class="form-check-label" for="inlineRadio8">Poor</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions4"
                id="inlineRadio9" value="Average" checked>
            <label class="form-check-label" for="inlineRadio9">Average</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions4"
                id="inlineRadio10" value="Good">
            <label class="form-check-label" for="inlineRadio10">Good</label>
        </div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="inlineRadioOptions4"
                id="inlineRadio11" value="Great">
            <label class="form-check-label" for="inlineRadio11">Great</label>
        </div>
        <div class="row">
            <label for="" class="form-label">Customer rating on call center service</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions5"
                id="inlineRadio12" value="Poor">
            <label class="form-check-label" for="inlineRadio12">Poor</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions5"
                id="inlineRadio13" value="Average" checked>
            <label class="form-check-label" for="inlineRadio13">Average</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions5"
                id="inlineRadio14" value="Good">
            <label class="form-check-label" for="inlineRadio14">Good</label>
        </div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="inlineRadioOptions5"
                id="inlineRadio15" value="Great">
            <label class="form-check-label" for="inlineRadio15">Great</label>
        </div>

    </div>

        <div class="mb-3">
               <button type="button" onclick="otpSend()" class="btn btn-info-gradien btn-sm btn-feedback"> Send OTP </button>
            <input class="form-control" id="otp" rows="3" maxLength="6";
                placeholder="Fill OTP"></input> 
        </div>
        
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Comments &
                queries</label>
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
                placeholder="Write Comments & queries"></textarea>
        </div>
    `;
  document.getElementById("feedbackData").innerHTML = dataValue;
}

function todayDate() {
  const currentdate = new Date();
  const month = +currentdate.getMonth() + 1;
  const datetime =
    currentdate.getDate() + "/" + month + "/" + currentdate.getFullYear();
  return datetime;
}

function submit_feedback() {
  //   console.log("update status")
  var first3 = document.querySelector(
    "input[name = inlineRadioOptions3]:checked"
  ).value;
  var first4 = document.querySelector(
    "input[name = inlineRadioOptions4]:checked"
  ).value;
  var first5 = document.querySelector(
    "input[name = inlineRadioOptions5]:checked"
  ).value;
  var otp = document.getElementById("otp").value;

  if (otp == otpValue) {
    alert("Successfully submit");
  } else {
    alert("Your otp is wrong");
  }

  let first6 = document.getElementById("exampleFormControlTextarea1").value;

  if (first3 == "Re-Open") {
    fetch(`${caller_api}/${caller_index}`, {
      method: "PATCH",
      body: JSON.stringify({
        Inprogress: "Re Open",
        Technician_Name: "",
        Technician_Number: "",
        Queries: first6,
        Feedback_date: todayDate(),
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        alert("successfully updated");
      })
      .then(() => {
        location.reload();
      });
  } else if (first3 == "Fully Resolved") {
    fetch(`${caller_api}/${caller_index}`)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((value) => {
        callerTechnician = value.Technician_Name;
        callerColony = value.Overseers;
        fetch(`${caller_api}/${caller_index}`, {
          method: "PATCH",
          body: JSON.stringify({
            Complaint_resolve: first3,
            Overseers_curstomer_rating: first4,
            Call_customer_rating: first5,
            Queries: first6,
            Inprogress: "Close",
            Feedback_date: todayDate(),
            Close_Time: getISTTime(),
          }),
          headers: {
            "Content-type": "application/json",
          },
        }).then((res) => {
          if (res.status === 402) {
            window.location = "../../../index.html";
          }
          alert("successfully Resolve");

          console.log("request to close complain for technician");
          fetch(addTech_api)
            .then((res) => {
              if (res.status === 402) {
                window.location = "../../../index.html";
              }
              return res.json();
            })
            .then((data) => {
              callerColony = callerColony.split(" ");
              callerColony.pop();
              callerColony = callerColony.join(" ");

              data.map((values, _) => {
                if (
                  values.Name.match(callerTechnician) &&
                  values.Manager_Name.match(callerColony)
                ) {
                  console.log(callerColony, callerTechnician);
                  fetch(`${updateTech_api}/${values._id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      option: "closeComplain",
                    }),
                    headers: {
                      "Content-type": "application/json",
                    },
                  }).then((res) => {
                    if (res.status === 402) {
                      window.location = "../../../index.html";
                    }
                    alert("successfully closed complain");
                    location.reload();
                  });
                }
              });
            });
        });
      });
  } else if (first3 == "Other Reason") {
    fetch(`${caller_api}/${caller_index}`, {
      method: "PATCH",
      body: JSON.stringify({
        Complaint_resolve: first3,
        Overseers_curstomer_rating: first4,
        Call_customer_rating: first5,
        Queries: first6,
        Feedback_date: result1,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        alert("successfully Resolve");
      })
      .then(() => {
        location.reload();
      });
  }
}

function getTechnicianName() {
  userAssing = document.getElementById("userOption").value;
}
let complainNumber;
let occupantName;
let occupantNumber;
let occupantQuarterNumber;
let work;

function assTechnician() {
  let techId;
  fetch(addTech_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      getTechnicianName();
      data.map((value, index) => {
        if (
          value.Name == userAssing &&
          value.Location === area &&
          value.Category === category.toUpperCase()
        ) {
          techId = value._id;
          fetch(`${caller_api}/${indexValue}`)
            .then((res) => {
              if (res.status === 402) {
                window.location = "../../../index.html";
              }
              return res.json();
            })
            .then((values) => {
              complainNumber = values.Complain_Number;
              occupantName = values.Ocupent_Name;
              occupantNumber = values.Contact_Number;
              occupantQuarterNumber = values.Qr_No;
              work = values.Work;
              console.log("testing");
              let path2show = caller_api + "/" + `${values._id}`;
              fetch(path2show, {
                method: "PATCH",
                body: JSON.stringify({
                  Technician_Name: value.Name,
                  Technician_Number: value.Contact,
                }),
                headers: {
                  "Content-type": "application/json",
                },
              }).then((res) => {
                if (res.status === 402) {
                  window.location = "../../../index.html";
                }
                console.log(userAssing, value.Name);
                alert("successfully assing tech");
              });
              fetch(`${updateTech_api}/${techId}`, {
                method: "PUT",
                body: JSON.stringify({
                  option: "addComplain",
                }),
                headers: {
                  "Content-type": "application/json",
                },
              }).then(async (res) => {
                if (res.status === 402) {
                  window.location = "../../../index.html";
                }
                const qtr = `${complainNumber}`;
                let smstext = `Dear Technician,\r\nA new ticket has been assigned to you. Please find the details below:\r\nTicket No: ${qtr} for Occupant: ${occupantQuarterNumber} \r\nRegards,\r\nMCL Helpline (PATIOD Patio Digital)`;
                smstext = encodeURIComponent(smstext);
                console.log(value.Contact);

                const response = await fetch("/send-complaint-msg", {
                  method: "POST",
                  body: JSON.stringify({
                    mobile: value.Contact,
                    templateId: "1007613418470276795",
                    msg: smstext,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (!response.ok) alert("Message not sent to technician");
                // await sendTechnicanMessage(value.Contact, complainNumber);
                alert("assing tech");

                // location.reload();
              });
            });
        }
      });
    });
}

let totalComplain = 0;
let totalOpen = 0;
let totalClose = 0;
async function sendTechnicanMessage(contact, complainNumber) {
  const qtr = `${complainNumber} for Qtr: ${occupantQuarterNumber}`;
  let smstext = `Dear Technician,\r\nA new ticket has been assigned to you. Please find the details below:\r\nTicket No: ${qtr} for Occupant: ${occupantQuarterNumber} \r\nRegards,\r\nMCL Helpline (PATIOD Patio Digital)`;
  smstext = encodeURIComponent(smstext);
  console.log(smstext);
  let text = `https://www.txtguru.in/imobile/api.php?username=patiodigital.com&password=29000803&source=PATIOD&dmobile=91${contact}&dlttempid=1007613418470276795&message=${smstext}`;
  await fetch(text);
}
// technician get a email to assing
function technician_assing(name, email) {
  technician_data(name, email);
  fetch(addTech_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      data.map((value, index) => {
        if (value.Name == name && value.Email_Id == email) {
          totalComplain++;
          let path2show = addTech_api + "/" + `${value._id}`;
          fetch(path2show, {
            method: "PATCH",
            body: JSON.stringify({
              Total_complaints: totalComplain,
              Open_complaints: totalComplain,
            }),
            headers: {
              "Content-type": "application/json",
            },
          }).then((res) => {
            if (res.status === 402) {
              window.location = "../../../index.html";
            }
            alert("successfully Assing");
          });
        }
      });
    });
}

// console.log(Inprogress)
if (Inprogress == "Close") {
  fetch(addTech_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      data.map((value, index) => {
        if (value.Name == name && value.Email_Id == email) {
          let values = value.Total_complaints;
          let open = values--;
          let close = values++;
          let path2show = addTech_api + "/" + `${value._id}`;
          fetch(path2show, {
            method: "PATCH",
            body: JSON.stringify({
              Open_complaints: open,
              Close_complaints: close,
            }),
            headers: {
              "Content-type": "application/json",
            },
          }).then((res) => {
            if (res.status === 402) {
              window.location = "../../../index.html";
            }
            //    alert("successfully Assing")
            window.location.href = "today'sComplain.html";
          });
        }
      });
    });
}

// update technician data
function technician_data(name, email) {
  fetch(addTech_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      // let datalength = data.length;
      data.map((value, index) => {
        if (value.Name == name && value.Email_Id == email) {
          totalComplain = value.Total_complaints;
          totalOpen = value.Open_complaints;
          totalClose = value.Close_complaints;
        }
      });
    });
}

let progressIndex = 0;
function progress(index) {
  //   console.log(index)
  progressIndex = index;
  document.getElementById("floatingTextarea2").value;
}

function progressBar() {
  // console.log(progressData)
  progressData = document.getElementById("progressOption").value;
  //    console.log(progressData)
}

function getISTTime() {
  var dateUTC = new Date(Date.now());
  var dateUTC = dateUTC.getTime();
  var dateIST = new Date(dateUTC);
  return dateIST.toString();
}

function complainProgress() {
  // console.log("progress bar value")

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

  let textArea = document.getElementById("floatingTextarea2").value;
  //    console.log("submit", textArea , user)
  let techName;
  let techNumber;
  if (progressData === "In Progress") {
    let path2show = caller_api + "/" + `${progressIndex}`;
    // console.log(path2show)
    fetch(path2show)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        techName = data.Technician_Name;
        techNumber = data.Technician_Number;
        fetch(path2show, {
          method: "PATCH",
          body: JSON.stringify({
            Inprogress: progressData,
            InprogressRemarks: textArea,
            InprogressDate: getISTTime(),
            InprogressTime: time,
            Technician_Name: techName,
            Technician_Number: techNumber,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }).then((res) => {
          if (res.status === 402) {
            window.location = "../../../index.html";
          }
          alert("Successfully progress bar updated");
          location.reload();
        });
      });
  } else if (progressData === "Complete") {
    let path2show = caller_api + "/" + `${progressIndex}`;
    fetch(path2show)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        techName = data.Technician_Name;
        techNumber = data.Technician_Number;
        // complete();

        fetch(path2show, {
          method: "PATCH",
          body: JSON.stringify({
            Inprogress: progressData,
            CompleteRemarks: textArea,
            CompleteDate: getISTTime(),
            CompleteTime: time,
            Technician_Name: techName,
            Technician_Number: techNumber,
          }),
          headers: {
            "Content-type": "application/json",
          },
        }).then((res) => {
          if (res.status === 402) {
            window.location = "../../../index.html";
          }
          alert("Successfully progress bar updated");
          location.reload();
        });
      });
  } else {
    alert("Select Status to update");
  }
}
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
                        new Date(value.Complaint_Date).toLocaleDateString()
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
                              class="badge-info">${new Date(
                                value.CompleteDate.slice(-1)[0]
                              ).toLocaleDateString()} ${value.CompleteTime.slice(
                                  -1
                                )}</span>
                          </li>`
                              : ""
                          }
                          ${
                            statusClose
                              ? `<li class="step">
                              <div class="bg-success mb-1">Close</div> <span
                                  class="text-success">${
                                    closeTime === "Invalid Date"
                                      ? " "
                                      : `${new Date(
                                          value.Feedback_date.slice(-1)[0]
                                        ).toLocaleDateString()} ${closeTime}`
                                  }</span>
                          </li>`
                              : ""
                          }
                          
                      </ul>
                  </div>
              </div>
          </div>
                        `;
      document.getElementById("showComplain").innerHTML = complain_list;
    });
}
// search functionality  caller progress wise
function com_searchBar() {
  let progress = document.getElementById("progressData").value;
  progressStatus = progress;
  searchParam = null;
  pagination();
}

// feedback
function feedback(indexValue) {
  fetch(`${caller_api}/${indexValue}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((value) => {
      let completeData = 1;
      let completeRemarks = 1;
      let reOpen = 1;
      let inProgress = 1;
      let inProgressRemarks = 1;
      let feedbackData = "";
      let k = 1;

      if (value.Inprogress[0] !== null && value.Inprogress[0] !== "") {
        k = 0;
      }
      if (value.CompleteDate[0] !== "" && value.CompleteDate[0] !== null) {
        completeData = 0;
      }
      if (
        value.CompleteRemarks[0] !== "" &&
        value.CompleteRemarks[0] !== null
      ) {
        completeRemarks = 0;
      }
      if (
        (value.Queries[0] !== null &&
          value.Queries[0] !== "" &&
          value.Queries[0] !== " ") ||
        value.Feedback_date[0] !== null
      ) {
        reOpen = 0;
      }
      if (value.InprogressDate[0] !== null && value.InprogressDate[0] !== "") {
        inProgress = 0;
      }
      if (
        value.InprogressRemarks[0] !== null &&
        value.InprogressRemarks[0] !== ""
      ) {
        inProgressRemarks = 0;
      }
      while (k < value.Inprogress.length) {
        if (value.Inprogress[k] == "Complete") {
          console.log(value.CompleteDate[completeData], completeData, k);

          flag = true;
          feedbackData += `
                      <tr>
                      <td>${
                        value.CompleteRemarks[completeRemarks]
                          ? value.CompleteRemarks[completeRemarks]
                          : " "
                      }</td>
                      <td>${new Date(
                        value.CompleteDate[completeData]
                      ).toLocaleDateString()} ${
            value.CompleteTime[completeData]
          }</td>
                      <td> <span class="text-primary">${
                        value.Inprogress[k]
                      }</span>
                       </td>
                     </tr>
                    `;
          completeData++;
          completeRemarks++;
        }
        if (value.Inprogress[k] == "Re Open") {
          feedbackData += `
                        <tr>
                        <td>${
                          value.Queries[reOpen] ? value.Queries[reOpen] : " "
                        }</td>
                        <td>${new Date(
                          value.Feedback_date[reOpen]
                        ).toLocaleDateString()}</td>
                        <td> <span class="text-primary">${
                          value.Inprogress[k]
                        }</span>
                         </td>
                       </tr>
                      `;
          reOpen++;
          // for(let i=1;i<value.Queries.length;i++){
          //    }
        }
        if (value.Inprogress[k] == "In Progress") {
          console.log(value.Inprogress[k]);
          feedbackData += `
                          <tr>
                          <td>${
                            value.InprogressRemarks[inProgressRemarks]
                              ? value.InprogressRemarks[inProgressRemarks]
                              : " "
                          }</td>
                          <td>${new Date(
                            value.InprogressDate[inProgress]
                          ).toLocaleDateString()} ${
            value.InprogressTime[inProgress]
          }</td>
                          <td> <span class="text-primary">${
                            value.Inprogress[k]
                          }</span>
                          </td>
                          </tr>
                          `;
          inProgress++;
          inProgressRemarks++;
        }
        k++;
      }
      document.getElementById("feedback_Manager").innerHTML = feedbackData;
    });
}

// universal search
function uni_search() {
  let progress = document.getElementById("universalSearch").value;
  searchParam = progress;
  progressStatus = null;
  pagination();
}

// new pagination jquery
function simpleTemplating(data, page) {
  var html = "<table>";
  let count = (page - 1) * pageSize;
  data[0].Complains.forEach((value) => {
    count++;
    let complainTime = "";
    if (value.Complaint_Time !== "") {
      var dateUTC = new Date(value.Complaint_Time);
      complainTime = dateUTC.toLocaleTimeString();
    }
    html += `
          <tr>
          <td>${count}</td>
       <td class='userList position-sticky start-0'><a key=${
         value._id
       } class="text-primary cursor-pointer"  data-bs-toggle="modal"
                 onclick="">${value.Complain_Number}</a></td>
         <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${
      complainTime === "Invalid Date" ? "" : complainTime
    } </td>
         <td>${value.Ocupent_Name}</td>
         <td>${value.Contact_Number}</td>
         <td>${value.EIS_No}</td>
         <td>${value.Qr_No}</td>
         <td>${value.Category}</td>
         <td>${value.Complain}</td>
         <td><button type="button"
         class="btn btn-info-gradien btn-sm btn-feedback"
         data-bs-toggle="modal"
         data-bs-target="#feedbackPopup" key=${value._id}>Feedback</button>
        </td>
         <td><span class="text-danger f-w-700 f-12">${value.Inprogress.slice(
           -1
         )}</span></td>
         ${
           value.Inprogress.slice(-1)[0] === "Close"
             ? ""
             : (value.Technician_Name === "" ||
                 value.Technician_Name === undefined) &&
               value.Inprogress.slice(-1)[0] !== "In Progress" &&
               value.Inprogress.slice(-1)[0] !== "Complete"
             ? `<td><button type="button" class="btn btn-primary-gradien btn-action technician-assign"
                  data-bs-toggle="modal" data-bs-target="#technicianPopup" key=${value._id}><i class="fa fa-user" aria-hidden="true" key=${value._id}></i></button>
              <button type="button" class="btn btn-success-gradien btn-action progress-update"
                  data-bs-toggle="modal" data-bs-target="#updateStatusPopup" key=${value._id}><i class="fa fa-repeat" key=${value._id} aria-hidden="true"></i></button>
          </td>`
             : value.Inprogress.slice(-1)[0] === "Complete"
             ? ""
             : `<td><button type="button" class="btn btn-success-gradien btn-action progress-update"
                  data-bs-toggle="modal" data-bs-target="#updateStatusPopup" key=${value._id}><i class="fa fa-repeat" key=${value._id} aria-hidden="true"></i></button></td>`
         }
     </tr>
         `;
  });
  html += "</table>";
  return html;
}

function pagination() {
  let api = "";
  if (progressStatus) {
    api = `${pagination_api}?&status=${progressStatus}&area=${area}&category=${category}&today=true`;
  } else if (searchParam) {
    api = `${search_api}?&search=${searchParam}&area=${area}&category=${category}&today=true`;
  } else {
    api = `${pagination_api}?&area=${area}&category=${category}&today=true`;
    console.log("object");
  }
  $("#pagination-container").pagination({
    dataSource: api,
    locator: "items",
    formatAjaxError: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 402) {
        window.location = "../../../index.html";
      }
    },
    totalNumberLocator: function (response) {
      if (response[0].totalCount.length > 0)
        return response[0].totalCount[0].count;
      return 0;
    },

    alias: {
      pageNumber: "page",
      pageSize: "limit",
    },
    className: "paginationjs-theme-blue paginationjs-big",
    autoHidePrevious: true,
    autoHideNext: true,
    callback: function (data, pagination) {
      var html = simpleTemplating(data, pagination.pageNumber);
      $("#m_complain_list").html(html);
      document.querySelectorAll(".userList").forEach((element) => {
        element.addEventListener("click", handleClickForUser);
      });
      document.querySelectorAll(".btn-feedback").forEach((element) => {
        element.addEventListener("click", handleFeedbackClick);
      });
      document.querySelectorAll(".technician-assign").forEach((element) => {
        element.addEventListener("click", handleTechnicianAssign);
      });
      document.querySelectorAll(".progress-update").forEach((element) => {
        element.addEventListener("click", handleProgressUpdate);
      });
    },
  });
}

pagination();
