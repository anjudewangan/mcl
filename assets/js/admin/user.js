// console.log("NEw employee List")

let complain_obj = {};

var apiUrl = employee_api;
const pageSize = 10;
let curPage = 1;
// fetch(employee_api).then((res)=>{
//     return res.json();
// }).then((data)=>{
//
//       let list = "";
//       let count = 0;
//     data.map((value,index)=>{
//         count++;
//         list +=` <tr>
//         <th>${count}</th>
//         <td>${value.Name}</td>
//         <td>${value.Contacti}</td>
//         <td>${value.COLONY}</td>
//         <td>${value.EIS}</td>
//         <td>${value.AREA}</td>
//         <td>Rajendra Nagar Colony</td>
//         <td>Water supply and
//             Pipe Leakage</td>
//         <td><button type="button"
//                 class="btn btn-success-gradien btn-sm btn-update"
//                 data-bs-toggle="modal" data-bs-target="#updateProcessPopup">
//                 Update Status
//             </button>
//             <button type="button"
//                 class="btn btn-success-gradien btn-sm btn-update"
//                 data-bs-toggle="modal" data-bs-target="#updateProcessPopup">
//                 Update Status
//             </button>

//             </td>
//        </tr>
//         `
//         document.getElementById("employee_list").innerHTML = list;
//     })

//  })

// let currentPage = 1;
// const limit = 20;
// let total = 0;
// const factsEl = document.querySelector('.facts');
// const loader = document.querySelector('.loader');
// const getfacts = async (page, limit) => {
//     const API_URL = `https://catfact.ninja/facts?page=${page}&limit=${limit}`;
//     const response = await fetch(API_URL);
//     // handle 404
//     if (!response.ok) {
//         throw new Error(`An error occurred: ${response.status}`);
//     }
//     return await response.json();
// }
// const showfacts = (facts) => {
//     facts.forEach(fact => {
//         const factEl = document.createElement('blockfact');
//         factEl.classList.add('fact');
//         factEl.innerHTML = `
//             ${fact.fact}
//         `;
//         factsEl.appendChild(factEl);
//     });
// };
// const hideLoader = () => {
//     loader.classList.remove('show');
// };

// const showLoader = () => {
//     loader.classList.add('show');
// };
// const hasMorefacts = (page, limit, total) => {
//     const startIndex = (page - 1) * limit + 1;
//     return total === 0 || startIndex < total;
// };

// const loadfacts = async (page, limit) => {
//     // show the loader
//     showLoader();
//     try {
//         // if having more facts to fetch
//         if (hasMorefacts(page, limit, total)) {
//             // call the API to get facts
//             const response = await getfacts(page, limit);
//             // show facts
//             showfacts(response.data);
//             // update the total
//             total = response.total;
//         }
//     } catch (error) {
//         console.log(error.message);
//     } finally {
//         hideLoader();
//     }
// };
// window.addEventListener('scroll', () => {
//     const {
//         scrollTop,
//         scrollHeight,
//         clientHeight
//     } = document.documentElement;

//     if (scrollTop + clientHeight >= scrollHeight - 5 &&
//         hasMorefacts(currentPage, limit, total)) {
//         currentPage++;
//         loadfacts(currentPage, limit);
//     }
// }, {
//     passive: true
// });

// loadfacts(currentPage, limit);

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
  var list = "";

  complain_obj
    .filter((row, index) => {
      let start = (curPage - 1) * pageSize;
      let end = curPage * pageSize;
      if (index >= start && index < end) return true;
    })
    .map((value, index) => {
      count++;
      list += ` <tr>
        <th>${count}</th>
        <td>${value.Name}</td>
        <td>${value.Contact}</td>
        <td>${value.Qr}</td>
        <td>${value.EIS}</td>
        <td>${value.AREA}</td>
        <td>${value.COLONY}</td>
        <td>${value.Designation}</td>
        <td><button type="button" onclick="updateEmployee(${
          count - 1
        })" class="btn btn-success-gradien btn-action" ><i class="fa fa-pencil" aria-hidden="true"></i></button>

        <button type="button" onclick="deleteTech(${
          count - 1
        })" class="btn btn-danger-gradien btn-action"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
            <button type="button" onclick="resetPassword(${
              value.EIS
            })" class="btn btn-primary-gradien btn-action"><i class="fa fa-repeat" aria-hidden="true"></i>
</button>

        </td>
       </tr>
        `;
      document.getElementById("employee_list").innerHTML = list;
    });
}

function previousPage() {
  if (curPage > 1) {
    curPage--;
    // count = count-5;
    document.querySelector("#value").innerHTML = curPage;
    renderTable(curPage);
  }
}

function nextPage() {
  if (curPage * pageSize < complain_obj.length) {
    curPage++;
    // count = count+5;
    document.querySelector("#value").innerHTML = curPage;
    renderTable(curPage);
  }
}

renderTable();

function numPages() {
  return Math.ceil(complain_obj.length / pageSize);
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
  const response = await fetch(apiUrl);
  if (response.status === 402) {
    window.location = "../../../index.html";
  }
  const coins = await response.json();
  complain_obj = coins;
  // console.log(complain_obj)
}

// delete employees
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
  console.log(deleteindex);
  fetch(employee_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      data.map((value, index) => {
        if (index == deleteindex) {
          let path2show = employee_api + "/" + `${value._id}`;
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

function updateEmployee(indexValue) {
  console.log(indexValue + "manager");
  localStorage.setItem("updateMan", JSON.stringify(indexValue));
  window.location.href = `editEmployee.html`;
}

// universal search
function uni_search() {
  let progress = document.getElementById("universalSearch").value;
  // console.log(progress)
  let list = "";
  complain_obj.map((value, index) => {
    if (
      value.Name.match(progress) ||
      value.Contact == progress ||
      value.EIS == progress
    ) {
      list += ` <tr>
    <th>${index}</th>
    <td>${value.Name}</td>
    <td>${value.Contact}</td>
    <td>${value.Qr}</td>
    <td>${value.EIS}</td>
    <td>${value.AREA}</td>
    <td>${value.COLONY}</td>
    <td>${value.Designation}</td>
    <td><button type="button" onclick="updateEmployee(${index})" class="btn btn-success-gradien btn-action" ><i class="fa fa-pencil" aria-hidden="true"></i></button>

    <button type="button" onclick="deleteTech(${index})" class="btn btn-danger-gradien btn-action"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
    <button type="button" onclick="resetPassword(${value.EIS})" class="btn btn-primary-gradien btn-action"><i class="fa fa-repeat" aria-hidden="true"></i>
</button>
    </td>
   </tr>
    `;
    }

    document.getElementById("employee_list").innerHTML = list;
  });
}

function resetPassword(eis) {
  console.log("🚀 ~ file: user.js:289 ~ resetPassword ~ eis:", eis);
  fetch(`${update_password_api}?reset=true&eis=${String(eis)}`, {
    method: "PATCH",
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    alert(`Password Reset for User: ${eis}`);
  });
}
