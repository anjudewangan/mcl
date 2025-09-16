// console.log("complain List");

let user = JSON.parse(localStorage.getItem("user"));
const eis = user.EIS;
let complain_obj = {};
const pageSize = 10;
let curPage = 1;
let progressStatus = null;
let searchParam = null;
const handleClickForUser = (e) => {
  showComplain(e.target.attributes.key.value);
};

let count = 0;
async function renderTable(page = 1) {
  await getData();
  if (page == 1) {
    prevButton.style.visibility = "hidden";
  } else {
    prevButton.style.visibility = "visible";
  }

  if (page == numPages()) {
    nextButton.style.visibility = "hidden";
  } else {
    nextButton.style.visibility = "visible";
  }

  // create html
  var complain_list = "";
  let api = "";
  if (searchParam) {
    api = `${search_api}?page=${page}&search=${searchParam}&eis=${eis}`;
  } else {
    api = `${pagination_api}?page=${page}&eis=${eis}`;
    console.log("object");
  }
  fetch(api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      count = (page - 1) * pageSize;
      data[0].Complains.map((value, index) => {
        count++;
        let complainTime = "";
        if (value.Complaint_Time !== "") {
          var dateUTC = new Date(value.Complaint_Time);
          complainTime = dateUTC.toLocaleTimeString();
        }
        complain_list += `
          <tr>
          <td>${count}</td>
       <td class='userList position-sticky start-0'><a key=${
         value._id
       } class="text-primary cursor-pointer"  data-bs-toggle="modal"
                 onclick="">${value.Complain_Number}</a></td>
         <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${
          complainTime === "Invalid Date" ? "" : complainTime
        } </td>
        
        
         <td>${value.Category}</td>
         <td>${value.Complain}</td>
         
         <td><span class="text-danger f-w-700 f-12">${
           value.Inprogress[value.Inprogress.length - 1]
         }</span></td>
        
     </tr>
         `;
        document.getElementById("complainList_data").innerHTML = complain_list;
      });
      document.querySelectorAll(".userList").forEach((element) => {
        element.addEventListener("click", handleClickForUser);
      });
    });
}

function previousPage() {
  if (curPage > 1) {
    curPage--;
    document.querySelector("#value").innerHTML = curPage;
    renderTable(curPage);
  }
}

function nextPage() {
  if (curPage * pageSize < complain_obj) {
    curPage++;
    document.querySelector("#value").innerHTML = curPage;
    renderTable(curPage);
  }
}

renderTable();

function numPages() {
  return Math.ceil(complain_obj / pageSize);
}

document
  .querySelector("#nextButton")
  .addEventListener("click", nextPage, false);
document
  .querySelector("#prevButton")
  .addEventListener("click", previousPage, false);
document.querySelector("#value").innerHTML = curPage;

//Fetch Data from API
async function getData() {
  let api = "";
  if (searchParam) {
    api = `${search_api}?&search=${searchParam}&eis=${eis}`;
  } else {
    api = `${pagination_api}?eis=${eis}`;
  }
  return new Promise((resolve, reject) => {
    fetch(api)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        if (!data[0].totalCount.length > 0) {
          document.getElementById("m_complain_list").innerHTML = "";
        } else {
          complain_obj = data[0].totalCount[0].count;
        }
        resolve();
      });
  });
}

// universal search
function uni_search() {
  let progress = document.getElementById("universalSearch").value;
  searchParam = progress;
  progressStatus = null;
  curPage = 1;
  document.querySelector("#value").innerHTML = curPage;
  renderTable();
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
