// console.log("caller list");

fetch(`${escalated_complains_api}?time=timel2&role=caller`, {
  redirect: "follow",
})
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then(
    (data) =>
      (document.getElementById("total_escalated_complains").innerHTML =
        data[0].totalCount[0].count)
  );
fetch(`${pagination_api}?status=Close&todayClose=true`, {
  redirect: "follow",
})
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then(
    (data) =>
      (document.getElementById("todayClose").innerHTML =
        data[0].totalCount[0].count)
  );
fetch(`${pagination_api}?status=Close`, {
  redirect: "follow",
})
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then(
    (data) =>
      (document.getElementById("totalClose").innerHTML =
        data[0].totalCount[0].count)
  );
fetch(`${pagination_api}?today=true`, {
  redirect: "follow",
})
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then(
    (data) =>
      (document.getElementById("todayData").innerHTML =
        data[0].totalCount[0].count)
  );
fetch(`${pagination_api}`, {
  redirect: "follow",
})
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then(
    (data) =>
      (document.getElementById("totalComplain").innerHTML =
        data[0].totalCount[0].count)
  );
