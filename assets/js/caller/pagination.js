
var coinsData = []
// var current_page = 1
// var records_per_page = 10;
var apiUrl = caller_api;
const pageSize = 5;
let curPage = 1;

async function renderTable(page = 1) {
  await getData()

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
  var cryptoCoin = "";
  coinsData.filter((row, index) => {
    let start = (curPage - 1) * pageSize;
    let end = curPage * pageSize;
    if (index >= start && index < end) return true;
  }).forEach(coin => {
    cryptoCoin += "<tr>";
    cryptoCoin += `<td> ${parseFloat(coin.btcPrice).toFixed(6)} </td>`;
    cryptoCoin += `<td> ${coin.Complain_Number}</td>`;
    cryptoCoin += `<td> ${coin.Complaint_Date} </td>`;
    cryptoCoin += `<td> ${coin.Ocupent_Name}</td>`;
    cryptoCoin += `<td> $${Math.round(coin.Contact_Number)} Billion</td>`;
    cryptoCoin += `<td> ${coin.Overseers}</td>`; "<tr>";
  });
  document.getElementById("complain_list").innerHTML = cryptoCoin;
}

function previousPage() {
  if (curPage > 1) {
    curPage--;
    document.querySelector('#value').innerHTML = curPage
    renderTable(curPage);
  }
}

function nextPage() {
  if ((curPage * pageSize) < coinsData.length) {
    curPage++;
    document.querySelector('#value').innerHTML = curPage
    renderTable(curPage);
  }
}

renderTable()

function numPages() {
  return Math.ceil(coinsData.length / pageSize);
}

document.querySelector('#nextButton').addEventListener('click', nextPage, false);
document.querySelector('#prevButton').addEventListener('click', previousPage, false);
document.querySelector('#value').innerHTML = curPage
//Fetch Data from API
async function getData() {
  const response = await fetch(apiUrl)
  if (response.status === 402) {
    window.location = "../../../index.html";
  }
  const coins = await response.json()
  coinsData = coins
  console.log(coinsData)
}
