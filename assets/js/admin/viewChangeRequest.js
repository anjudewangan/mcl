const pageSize = 10;
let searchParam = null;
// new pagination jquery
function simpleTemplating(data, page) {
  var html = "<table>";
  let count = (page - 1) * pageSize;
  data[0].employees.forEach((value) => {
    count++;
    html += `
          <tr>
          <td>${count}</td>
         <td>${value.EIS}</td>
         <td>${value.Name}</td>
         <td>${value.Contact}</td>
         <td>${value.COLONY}</td>
         <td>${value.Designation}</td>
         <td>${value.DEPT}</td>
         <td>${value.Qr}</td>
         <td>
         <button type="button" class="btn btn-success-gradien btn-action" data-bs-toggle="tooltip" data-bs-placement="top" title="Accept Request" onclick="acceptRequest(${value.EIS})" ><i class="fa fa-check" aria-hidden="true"></i></button>
         
         <button type="button" class="btn btn-danger-gradien btn-action" data-bs-toggle="tooltip" data-bs-placement="top" title="Reject Request" onclick="rejectRequest(${value.EIS})"><i class="fa fa-times" aria-hidden="true"></i></button>
         </td>

     </tr>
         `;
  });
  html += "</table>";
  return html;
}

function pagination() {
  let api = "";
  if (searchParam) {
    api = `${update_employee_api}?&eis=${searchParam}`;
  } else {
    api = `${update_employee_api}?`;
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
      $("#changeRequestList").html(html);
    },
  });
}

pagination();

const rejectRequest = (eis) => {
  fetch(`${baseUrl}/update-employee/${eis}?reject=true`, {
    method: "PATCH",
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    location.reload();
  });
};

const acceptRequest = (eis) => {
  fetch(`${baseUrl}/update-employee/${eis}`, {
    method: "PATCH",
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    location.reload();
  });
};

function search() {
  searchParam = document.getElementById("searchValue").value;
  pagination();
}
