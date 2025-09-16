let searchParam = null
const pageSize = 10;
let curPage = 1;

function updateManager(id) {
  localStorage.setItem("updateMan", JSON.stringify(id));
  window.location.href = `editManager.html`;
}
// delete manager
function deleteManager(id) {
  // data-bs-toggle="modal" data-bs-target="#deletePopup"
  $("#deletePopup").modal("show");

  let deleteData = `
    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
    <button type="button" class="btn btn-success" id="confirmManagerDelete" key=${id}>Confirm</button>
    `;
  document.getElementById("deleteConfirm").innerHTML = deleteData;
  document
    .getElementById("confirmManagerDelete")
    .addEventListener("click", (e) => {
      fetch(`${excalated_matrix_api}/${e.target.attributes.key.value}`, {
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
    });
}

function uni_search() {
  searchParam = document.getElementById("universalSearch").value;
  pagination();
}
// new pagination jquery
function simpleTemplating(data, page) {
  var html = "<table>";
  let count = (page - 1) * pageSize;
  data[0].employee.forEach((value) => {
    count++;
    html += `
       <tr>
       <td>${count}</td>
       <td>${value.Name}</td>
       <td>${value.Contact}</td>
       <td>${value.UserID}</td>
       <td>${value.Password}</td>
       <td>${value.Area}</td>
       <td>${value.Email_Id}</td>
       <td onclick="popup(${count})">${value.Category}</td>
       <td>${value.Level} </td>
       <td>${value.Designation}</td>
       <td><button type="button" class="btn btn-success-gradien btn-action update-manager" ><svg xmlns="http://www.w3.org/2000/svg" key=${value._id} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg></button>

       <button type="button" key=${value._id} class="btn btn-danger-gradien btn-action delete-manager"><svg xmlns="http://www.w3.org/2000/svg" key=${value._id} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2" ><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>
       </td>
   </tr>
       `;
  });
  html += "</table>";
  return html;
}

function pagination() {
  let api = `${excalated_matrix_api}`;

  if (searchParam) {
    api = `${excalated_matrix_api}?&search=${searchParam}`;
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
      $("#employee_list").html(html);
      document.querySelectorAll(".update-manager").forEach((element) => {
        element.addEventListener("click", handleUpdateManager);
      });
      document.querySelectorAll(".delete-manager").forEach((element) => {
        element.addEventListener("click", handleDeleteManager);
      });
    },
  });
}

pagination();
const handleUpdateManager = (e) => {
  updateManager(e.target.attributes.key.value)
}
const handleDeleteManager = (e) => {
  deleteManager(e.target.attributes.key.value)
}