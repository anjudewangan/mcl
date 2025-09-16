let complain_obj = {};
let page;
var apiUrl = ``;
const pageSize = 10;
let curPage = 1;
let progressStatus = null;
let searchParam = null;
let startDate = null;
let endDate = null;

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

// universal search
function uni_search() {
  let progress = document.getElementById("universalSearch").value;
  searchParam = progress;
  progressStatus = null;
  pagination();
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

let complainNumber;
let occupantNumber;
function getUserData(index) {
  return new Promise((resolve, reject) => {
    fetch(`${caller_api}/${index}`)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((value) => {
        complainNumber = value.Complain_Number;
        occupantNumber = value.Contact_Number;
        resolve();
      });
  });
}

let otpValue = "";
async function otpSend() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  otpValue = OTP;
  await getUserData(caller_index);
  sendOtpMsg(OTP);
}
function sendOtpMsg(Otp) {
  let smstext = `Dear Sir,\r\n\r\nYour work closure confirmation OTP is ${Otp} for Ticket No. ${complainNumber}.\r\n\r\nThank you for your cooperation.\r\n\r\nRegards,\r\nMCL7090 team (PATIOD - Patio Digital)`;
  smstext = encodeURIComponent(smstext);

  console.log(smstext);
  let text = `https://www.txtguru.in/imobile/api.php?username=patiodigital.com&password=29000803&source=PATIOD&dmobile=91${occupantNumber}&dlttempid=1007895167159343406&message=${smstext}`;
  fetch(text, {
    headers: {
      "Access-Control-Allow-Origin": "no-cors",
    },
  }).then((res) => {
    return res.json();
  });
}
let callerTechnician;
let callerManager;
function getISTTime() {
  var dateUTC = new Date(Date.now());
  var dateUTC = dateUTC.getTime();
  var dateIST = new Date(dateUTC);
  return dateIST.toString();
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
        Feedback_date: getISTTime(),
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
        callerColony = value.Colony;
        fetch(`${caller_api}/${caller_index}`, {
          method: "PATCH",
          body: JSON.stringify({
            Complaint_resolve: first3,
            Overseers_curstomer_rating: first4,
            Call_customer_rating: first5,
            Queries: first6,
            Inprogress: "Close",
            Feedback_date: getISTTime(),
            Close_Time: getISTTime(),
          }),
          headers: {
            "Content-type": "application/json",
          },
        }).then((res) => {
          if (res.status === 402) {
            window.location = "../../../index.html";
          }
          fetch(addTech_api)
            .then((res) => {
              if (res.status === 402) {
                window.location = "../../../index.html";
              }
              return res.json();
            })
            .then((data) => {
              data.map((values, _) => {
                if (
                  values.Name === callerTechnician &&
                  values.Location === callerColony
                ) {
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
        Feedback_date: getISTTime(),
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

const handleClickForUser = (e) => {
  showComplain(e.target.attributes.key.value);
};

const handleFeedbackClick = (e) => {
  feedback(e.target.attributes.key.value);
};

const handleStatusUpdate = (e) => {
  update_Status(e.target.attributes.key.value);
};

// new pagination jquery
function simpleTemplating(data, page) {
  var html = "<table>";
  let count = (page - 1) * pageSize;
  data[0].Complains.forEach((value) => {
    count++;
    let complainTime = "";
    if (value.Complaint_Time !== "") {
      let dateUTC = new Date(value.Complaint_Time);
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
             : `</td>
            <td id="updateButton"> <button type="button"
            class="btn btn-success-gradien btn-sm btn-update"
            data-bs-toggle="modal" data-bs-target="#updateProcessPopup" key=${value._id}>
            Update Status
        </button>
        </td>`
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
    api = `${pagination_api}?&status=${progressStatus}${
      startDate ? `&startDate=${startDate}&endDate=${endDate}` : ""
    }`;
  } else if (searchParam) {
    api = `${search_api}?&search=${searchParam}`;
  } else {
    api = `${pagination_api}?${
      startDate ? `startDate=${startDate}&endDate=${endDate}` : ""
    }`;
    console.log("object");
  }
  $("#pagination-container").pagination({
    dataSource: api,
    locator: "items",
    formatAjaxError: function (jqXHR, textStatus, errorThrown) {if (jqXHR.status === 402) {window.location = '../../../index.html'}},
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
      $("#complain_list").html(html);
      document.querySelectorAll(".userList").forEach((element) => {
        element.addEventListener("click", handleClickForUser);
      });
      document.querySelectorAll(".btn-feedback").forEach((element) => {
        element.addEventListener("click", handleFeedbackClick);
      });
      document.querySelectorAll(".btn-update").forEach((element) => {
        element.addEventListener("click", handleStatusUpdate);
      });
    },
  });
}

pagination();

function exportData() {
  const api = `${baseUrl}/export?${
    progressStatus && progressStatus !== "All" && progressStatus !== ""
      ? `&status=${progressStatus}`
      : ""
  }${startDate ? `&startDate=${startDate}&endDate=${endDate}` : ""}`;
  document.getElementById(
    "loader"
  ).innerHTML = `<div class="loader-wrapper"><h2>Downloading file Please wait.</h2></div>`;
  fetch(api).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    const headers = [...res.headers];
    res.blob().then((data) => {
      var file = window.URL.createObjectURL(data);
      var file_path = file;
      var a = document.createElement("A");
      a.href = file_path;
      a.download = `Data-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      document.getElementById("loader").innerHTML = ``;
    });
  });
}

$(function () {
  $('input[name="daterange"]').daterangepicker(
    {
      opens: "right",
    },
    function (start, end, label) {
      startDate = `${start.format("YYYY-MM-DD")}T00:00:00.000Z`;
      endDate = `${end.format("YYYY-MM-DD")}T00:00:00.000Z`;
      pagination();
    }
  );
});

function resetDate() {
  startDate = null;
  endDate = null;
  pagination();
}
