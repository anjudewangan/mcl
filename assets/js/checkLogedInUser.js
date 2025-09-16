if (localStorage.getItem("role")) {
  console.log("from if");
  switch (localStorage.getItem("role")) {
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
      console.log("super-admin");
      window.location.replace("./super_admin/index.html");
      break;
    }
    default:
      break;
  }
}
