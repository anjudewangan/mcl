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
function displayValue() {
  const category = document.getElementById("category").value;
  fetch(`${complain_count_api}?category=${category}`)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((count_data) => {
      let tableData = "";
      Object.keys(count_data).forEach((key, idx) => {
        tableData += `<tr>
                        <th>${idx + 1}</th>
                        <th>${key}</th>
                        <th>${
                          count_data[key]["Close"] + count_data[key]["Open"]
                        }</th>
                        <th>${count_data[key]["Open"]}</th>
                        <th>${count_data[key]["Close"]}</th>
                      </tr>`;
      });
      console.log(tableData);
      document.getElementById("complain_count").innerHTML = tableData;
    });
}
