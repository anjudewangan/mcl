// console.log("caller list");
let complain_length = 0;

var currentdate = new Date();
var month = +currentdate.getMonth() + 1;
//    console.log(currentdate)
var datetime =
  currentdate.getDate() +
  "/" +
  month +
  "/" +
  currentdate.getFullYear() +
  "  " +
  currentdate.getHours() +
  ":" +
  currentdate.getMinutes() +
  ":" +
  currentdate.getSeconds();
//    console.log(datetime)
const myArray = datetime.split("  ");
//    console.log(myArray)
date = myArray[0];
time = myArray[1];

fetch(`${escalated_complains_api}?time=timel2&role=caller`)
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

fetch(`${pagination_api}?status=Close&todayClose=true`)
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
fetch(`${pagination_api}?status=Close`)
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
fetch(`${pagination_api}?today=true`)
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
fetch(`${pagination_api}`)
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
