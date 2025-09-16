let user = JSON.parse(localStorage.getItem("user"));
fetch(`${baseUrl}/employee-detalis?eis=${user.EIS}`, {
  redirect: "follow",
})
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then((data) => {
    localStorage.setItem("user", JSON.stringify(data[0]));
  });
const eis = user.EIS;

fetch(`${pagination_api}?&eis=${eis}`, {
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
      (document.getElementById("totalComplain_raise").innerHTML =
        data[0].totalCount[0].count)
  );
fetch(`${pagination_api}?status=Close&eis=${eis}`, {
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
      (document.getElementById("totalComplain_close").innerHTML =
        data[0].totalCount[0].count)
  );
