console.log("data fetch")
let employee_obj = {};

async function fetchData(){
      let res = await fetch(employee_api) 
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      let data = await res.json()
      employee_obj = data
      // console.log(data)
} 

fetchData();