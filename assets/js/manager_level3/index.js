let complain_length = 0;

user = JSON.parse(localStorage.getItem("user"));
area = user.Area;
category = user.Category;
category = category.charAt(0) + category.slice(1).toLowerCase();

fetch(
  `${escalated_complains_api}?time=timel3&role=manager&area=${area}&category=${category}`
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
fetch(`/escalated/managerEscalatedComplains`).then((res) => res.json()).then((data) => {
  document.getElementById("l3_escalated_complaints").innerHTML = data.totalCount;
})