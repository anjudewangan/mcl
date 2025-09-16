let complain_length = 0;

let managerName = "";
let area = "";
let category = "";
user = JSON.parse(localStorage.getItem("user"));
console.log(user);
area = user.Area;
managerName = user.Name;
category = user.Category;
category = category.charAt(0) + category.slice(1).toLowerCase();
setTimeout(() => {
  fetch(
    `${escalated_complains_api}?time=timel2&role=manager&area=${area}&category=${category}`
  )
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then(
      (data) =>
        (document.getElementById("total_escalated_complains").innerHTML =
          data[0].totalCount.length > 0 ? data[0].totalCount[0].count : 0)
    );
  fetch(`${pagination_api}?today=true&area=${area}&category=${category}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then(
      (data) =>
        (document.getElementById("complain_raised_today").innerHTML =
          data[0].totalCount.length > 0 ? data[0].totalCount[0].count : 0)
    );
  fetch(`${pagination_api}?area=${area}&category=${category}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then(
      (data) =>
        (document.getElementById("complain_raised").innerHTML =
          data[0].totalCount.length > 0 ? data[0].totalCount[0].count : 0)
    );
  fetch(`${pagination_api}?status=Close&area=${area}&category=${category}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then(
      (data) =>
        (document.getElementById("total_close_data").innerHTML =
          data[0].totalCount.length > 0 ? data[0].totalCount[0].count : 0)
    );
  fetch(
    `${pagination_api}?status=Close&todayClose=true&area=${area}&category=${category}`
  )
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then(
      (data) =>
        (document.getElementById("totalClose").innerHTML =
          data[0].totalCount.length > 0 ? data[0].totalCount[0].count : 0)
    );
}, 500);

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
    data.map((value, index) => {
      if (value.Location === user.Area && value.Category === user.Category) {
        count++;
        addTech += `
       <tr>
       <td>${count}</td>
       <td>${value.Name}</td>
       <td>${value.Total_complaints}</td>
       <td>${value.Open_complaints}</td>
       <td>${value.Close_complaints}</td>
   </tr>
       `;
      }
      document.getElementById("addTech").innerHTML = addTech;
    });
  });
