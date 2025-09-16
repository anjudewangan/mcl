let manager_userName = "";
let manager_password = "";

document.getElementById("btnSignIn").addEventListener("click", userLogin);

function userLogin(e) {
  e.preventDefault();
  // console.log("manager login")
  let userName = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  fetch(`${baseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.employee));
      localStorage.setItem("role", data.role);
      switch (data.role) {
        case "employee": {
          window.location.replace("./employee/index.html");
          break;
        }
        case "caller": {
          window.location.replace("./caller/index.html");
          break;
        }
        case "admin": {
          window.location.replace("./admin/index.html");
          break;
        }
        case "managerl1": {
          window.location.replace("./manager/index.html");
          break;
        }
        case "managerl2": {
          window.location.replace("./manager_level2/index.html");
          break;
        }
        case "managerl3": {
          window.location.replace("./manager_level3/index.html");
          break;
        }
        case "super-admin": {
          window.location.replace("./super_admin/index.html");
          break;
        }
        default:
          break;
      }
    });
  // fetch(excalated_matrix_api)
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     data.map((value, index) => {
  //       console.log("level 3");

  //       if (
  //         value.UserID == userName &&
  //         value.Password == password &&
  //         value.Level == 1
  //       ) {
  //         manager_userName = value.UserID;
  //         manager_password = value.password;
  //         // console.log(value.UserID +"userId", value.password)
  //         localStorage.setItem("user", JSON.stringify(value.UserID));
  //         window.location.replace("./manager/index.html");
  //       }
  //       if (
  //         value.UserID == userName &&
  //         value.Password == password &&
  //         value.Level == 2
  //       ) {
  //         manager_userName = value.UserID;
  //         manager_password = value.password;
  //         // console.log(value.UserID +"userId", value.password)
  //         localStorage.setItem("user", JSON.stringify(value.UserID));
  //         window.location.replace("./manager_level2/index.html");
  //       }
  //       if (
  //         value.UserID == userName &&
  //         value.Password == password &&
  //         value.Level == 3
  //       ) {
  //         console.log("level 3");
  //         manager_userName = value.UserID;
  //         manager_password = value.password;
  //         // console.log(value.UserID +"userId", value.password)
  //         localStorage.setItem("user", JSON.stringify(value.UserID));
  //         window.location.replace("./manager_level3/index.html");
  //       }

  //       if (
  //         value.UserID == userName &&
  //         value.Password == password &&
  //         value.Level == 5
  //       ) {
  //         console.log("level 5");
  //         manager_userName = value.UserID;
  //         manager_password = value.password;
  //         // console.log(value.UserID +"userId", value.password)
  //         localStorage.setItem("user", JSON.stringify(value.UserID));
  //         window.location.replace("./super_admin/index.html");
  //       }

  //       //  else if(userName == "ARUN" && password =="ARUN@123"){
  //       //     window.location.replace("./caller/index.html")

  //       //  }
  //     });
  //   });

  // fetch(employee_api)
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     data.map((value, index) => {
  //       // console.log(value)
  //       if (value.EIS == userName && value.EIS == password) {
  //         employee_userName = value.EIS;
  //         employee_password = value.EIS;
  //         //  console.log(value.UserID +"userId", value.password)
  //         localStorage.setItem("user", JSON.stringify(value.EIS));
  //         window.location.replace("./employee/index.html");
  //       }
  //     });
  //   });

  // fetch(admin_api)
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     data.map((value, index) => {
  //       // console.log(value)
  //       if (value.UserName == userName && value.Password == password) {
  //         let admin_userName = value.UserName;
  //         //  console.log(value.UserID +"userId", value.password)
  //         localStorage.setItem("user", JSON.stringify(value.UserName));
  //         window.location.replace("./admin/index.html");
  //       }
  //     });
  //   });

  // fetch(caller_data_api)
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     data.map((value, index) => {
  //       // console.log(value)
  //       if (value.UserName == userName && value.Password == password) {
  //         let admin_userName = value.UserName;
  //         //  console.log(value.UserID +"userId", value.password)
  //         localStorage.setItem("user", JSON.stringify(value.UserName));
  //         window.location.replace("./caller/index.html");
  //       }
  //     });
  //   });
}
