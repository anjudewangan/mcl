let complain_obj = {};

var apiUrl = caller_data_api;
const pageSize = 10;
let curPage = 1;

fetch(apiUrl)
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then((data) => {
    complain_obj = data;
    let complain_list = "";
    //    document.getElementById("totalComplain").innerHTML = complain_length;
    data.map((value, index) => {
      complain_list += `
        <tr>
        <td>${value.UserName}</td>
        <td>${value.Password}</td>
        <td>${value.Contact}</td>
        <td>${value.Email_Id}</td>
        <td>${value.Date}</td>
        <td>
        <button type="button" onclick="deleteTech(${index})" class="btn btn-danger-gradien btn-action"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2" ><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
        </td>
    </tr>
        `;
      document.getElementById("complain_list").innerHTML = complain_list;
    });
  });

// // search functionality  caller progress wise
function com_searchBar() {
  let progress = document.getElementById("progressData").value;
  console.log(progress);
  let complain_list = "";
  complain_obj.filter((value, index) => {
    if (value.Inprogress[0].match(progress)) {
      let complainTime = "";
      if (value.Complaint_Time !== "") {
        var dateUTC = new Date(value.Complaint_Time);
        complainTime = dateUTC.toLocaleTimeString();
        console.log("complaintime", complainTime);
      }
      complain_list += `
                <tr>
                <td><a class="text-primary"  data-bs-toggle="modal"
                         onclick="showComplain(${index})">${
        value.Complain_Number
      }</a></td>
                <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${
        complainTime === "Invalid Date" ? "" : complainTime
      }</td>
                <td>${value.Ocupent_Name}</td>
                <td>${value.Contact_Number}</td>
                <td>${value.Qr_No}</td>
                <td>${value.EIS_No}</td>
                <td>${value.Colony}</td>
                <td>${value.Work}</td>
                <td><button type="button"
                        class="btn btn-info-gradien btn-sm btn-feedback"
                        data-bs-toggle="modal"
                        data-bs-target="#feedbackPopup">Feedback</button>
                </td>
                <td> <span class="text-primary f-w-700 f-12">${
                  value.Inprogress[value.Inprogress.length - 1]
                }</span>
                </td>
                <td><button type="button"
                        class="btn btn-success-gradien btn-sm btn-update"
                        data-bs-toggle="modal" onclick="update_Status(${index})">
                        Update Status
                    </button></td>
            </tr>
                `;
    }
    document.getElementById("complain_list").innerHTML = complain_list;
  });
}

// universal search
function uni_search() {
  let progress = document.getElementById("universalSearch").value;
  // console.log(progress)
  let complain_list = "";
  complain_obj.map((value, index) => {
    if (
      value.Inprogress[0].match(progress) ||
      value.Ocupent_Name.match(progress) ||
      value.Colony.match(progress) ||
      value.Date.match(progress) ||
      value.EIS_No.match(progress) ||
      value.Contact_Number.match(progress) ||
      value.Category.match(progress) ||
      value.Complain_Number.match(progress)
    ) {
      let complainTime = "";
      if (value.Complaint_Time !== "") {
        var dateUTC = new Date(value.Complaint_Time);
        complainTime = dateUTC.toLocaleTimeString();
        console.log("complaintime", complainTime);
      }
      complain_list += `
            <tr>
            <td><a class="text-primary"  data-bs-toggle="modal"
                     onclick="showComplain(${index})">${
        value.Complain_Number
      }</a></td>
            <td>${new Date(value.Complaint_Date).toLocaleDateString()} ${
        complainTime === "Invalid Date" ? "" : complainTime
      }</td>
            <td>${value.Ocupent_Name}</td>
            <td>${value.Contact_Number}</td>
            <td>${value.Qr_No}</td>
            <td>${value.EIS_No}</td>
            <td>${value.Colony}</td>
            <td>${value.Work}</td>
        </tr>
            `;
      document.getElementById("complain_list").innerHTML = complain_list;
    }
  });
}

// pagination part

// var coinsData = []
// var current_page = 1
// var records_per_page = 10;
// var apiUrl = caller_api;
// const pageSize = 5;
// let curPage = 1;

function deleteTech(index) {
  console.log("delete tech");
  // data-bs-toggle="modal" data-bs-target="#deletePopup"
  $("#deletePopup").modal("show");

  let deleteData = `
    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-success" onclick="deleteIndex(${index})">Confirm</button>
    `;
  document.getElementById("deleteConfirm").innerHTML = deleteData;
  // console.log(index);
}

function deleteIndex(deleteindex) {
  fetch(caller_data_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      data.map((value, index) => {
        if (index == deleteindex) {
          let path2show = caller_data_api + "/" + `${value._id}`;
          fetch(path2show, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          }).then((res) => {
            if (res.status === 402) {
              window.location = "../../../index.html";
            }
            alert("Successfully deleted");
            location.reload();
          });
        }
      });
    });
  //    console.log(deleteindex +"delete");
}
