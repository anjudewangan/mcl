let complain_obj = {};
let progressStatus = null;
let searchParam = null;
let date = "";
let pageSize = 10;

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
       <td class='userList position-sticky start-0'><a key=${value._id
      } class="text-primary cursor-pointer"  data-bs-toggle="modal"
                 onclick="">${value.Complain_Number}</a></td>
         <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${complainTime === "Invalid Date" ? "" : complainTime
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
         ${value.Inprogress.slice(-1)[0] === "Close"
        ? ""
        : `</td>
            <td id="updateButton"> <button type="button"
            class="btn btn-success-gradien btn-sm btn-update"
            data-bs-toggle="modal" data-bs-target="#updateProcessPopup" key=${value._id}>
            Force Close
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
    api = `${pagination_api}?today=true&status=${progressStatus}`;
  } else if (searchParam) {
    api = `${search_api}?today=true&search=${searchParam}`;
  } else {
    api = `${pagination_api}?today=true`;
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
      $("#complain_list").html(html);
      document.querySelectorAll(".userList").forEach((element) => {
        element.addEventListener("click", handleClickForUser);
      });
      document.querySelectorAll(".btn-feedback").forEach((element) => {
        element.addEventListener("click", handleFeedbackClick);
      });
      document.querySelectorAll(".btn-update").forEach((element) => {
        element.addEventListener("click", handleForceClose);
      });
    },
  });
}

pagination();

const handleClickForUser = (e) => {
  showComplain(e.target.attributes.key.value);
};
const handleFeedbackClick = (e) => {
  feedback(e.target.attributes.key.value);
};
const handleForceClose = (e) => {
  update_Status(e.target.attributes.key.value);
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

let otpValue = "";
function otpSend() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  // console.log( "your otp "+ OTP);
  otpValue = OTP;
}

function submit_feedback() {
  //   console.log("Force Close")
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

  //  console.log(first3 , first4 , first5 , first6)

  if (first3 == "Re Open") {
    fetch(caller_api)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        data.map((value, index) => {
          // const result1 = new Date().toLocaleDateString('en-GB');
          if (index == caller_index) {
            let path2show = caller_api + "/" + `${value._id}`;
            fetch(path2show, {
              method: "PATCH",
              body: JSON.stringify({
                Inprogress: "Open",
                Technician_Name: "",
                Technician_Number: "",
                InprogressDate: "",
                InprogressTime: "",
                CompleteDate: "",
                CompleteTime: "",
                InprogressRemarks: "",
                CompleteRemarks: "",
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
          }
        });
      });
  } else if (first3 == "Fully Resolved") {
    fetch(caller_api)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        data.map((value, index) => {
          const result1 = new Date().toLocaleDateString("en-GB");
          if (index == caller_index) {
            let path2show = caller_api + "/" + `${value._id}`;
            fetch(path2show, {
              method: "PATCH",
              body: JSON.stringify({
                Complaint_resolve: first3,
                Overseers_curstomer_rating: first4,
                Call_customer_rating: first5,
                Queries: first6,
                Inprogress: "Close",
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
        });
      });
  } else if (first3 == "Other Reason") {
    fetch(caller_api)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        data.map((value, index) => {
          const result1 = new Date().toLocaleDateString("en-GB");
          if (index == caller_index) {
            let path2show = caller_api + "/" + `${value._id}`;
            fetch(path2show, {
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
        });
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
function getISTTime() {
  var dateUTC = new Date(Date.now());
  var dateUTC = dateUTC.getTime();
  var dateIST = new Date(dateUTC);
  return dateIST.toString();
}

function update_Status(caller_index) {
  var currentdate = new Date();
  var month = +currentdate.getMonth() + 1;
  //    console.log(currentdate)
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
  //    console.log(datetime)
  const myArray = datetime.split("  ");
  //    console.log(myArray)
  let date = myArray[0];

  fetch(`${caller_api}/${caller_index}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((value) => {
      let path2show = caller_api + "/" + `${value._id}`;
      callerTechnician = value.Technician_Name;
      callerColony = value.Colony;
      fetch(path2show, {
        method: "PATCH",
        body: JSON.stringify({
          Inprogress: "Close",
          Feedback_date: getISTTime(),
          Close_Time: getISTTime(),
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
          // close Complain
          console.log("request to close complain for technician");
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
        })
        .then(() => {
          location.reload();
        });
    });
}
