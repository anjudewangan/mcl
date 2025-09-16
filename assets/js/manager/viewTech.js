let updateIndexValue = JSON.parse(localStorage.getItem("updateIndexValue"));
const user = JSON.parse(localStorage.getItem("user"));
const area = user.Area;
const category = user.Category;
let technician_obj = {};
fetch(addTech_api)
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then((data) => {
    let addTech = "";
    let count = 0;
    technician_obj = data;
    data.map((value, index) => {
      if (value.Location === area && value.Category === category) {
        count++;
        addTech += `
      <tr>
      <td>${count}</td>
      <td>${value.Name}</td>
      <td>${value.Contact}</td>
      <td>${value.Email_Id}</td>
      <td><button type="button" onclick="editTech(${index})"
                  class="btn btn-success-gradien btn-action"><i class="fa fa-pencil"></i></button>
          <button type="button" class="btn btn-danger-gradien btn-action"
          onclick="deleteTech(${index})" ><i
          class="fa fa-trash"></i></button>
      </td>
  </tr>
  </tr>
      `;
      }
      document.getElementById("viewTech").innerHTML = addTech;
    });
  });

function deleteTech(index) {
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
  fetch(addTech_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      data.map((value, index) => {
        if (index == deleteindex) {
          let path2show = addTech_api + "/" + `${value._id}`;
          fetch(path2show, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          }).then(() => {
            alert("Successfully deleted");
            location.reload();
          });
        }
      });
    });
  //    console.log(deleteindex +"delete");
}

function editTech(index) {
  updateIndexValue = index;
  localStorage.setItem("updateIndexValue", JSON.stringify(index));
  window.location.href = `editTechnician.html`;
}

// search box
function tech_search() {
  // console.log("data");
  let search_data = document.getElementById("search_field").value;
  //  console.log(search_data)
  technician_obj.map((value, index) => {
    let count = 0;
    let addTech = "";
    if (
      value.Name.match(search_data) ||
      value.Contact.match(search_data) ||
      value.Email_Id.match(search_data) ||
      value.Location.match(search_data)
    ) {
      count++;
      addTech += `
            <tr>
            <td>${count}</td>
            <td>${value.Name}</td>
            <td>${value.Contact}</td>
            <td>${value.Email_Id}</td>
            <td><button type="button" onclick="editTech(${index})"
                        class="btn btn-success-gradien btn-action"><i class="fa fa-pencil"></i></button>
                <button type="button" class="btn btn-danger-gradien btn-action"
                onclick="deleteTech(${index})" ><i
                class="fa fa-trash"></i></button>
            </td>
        </tr>
        </tr>
            `;
      document.getElementById("viewTech").innerHTML = addTech;
    }
  });
}
