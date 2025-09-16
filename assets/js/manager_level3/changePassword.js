const user = JSON.parse(localStorage.getItem("user"));

function changePassword(e) {
  e.preventDefault();
  const currentPassword = e.target.currentPassword.value;
  const newPassword = e.target.newPassword.value;
  const confirmPassword = e.target.confirmPassword.value;
  if (newPassword === confirmPassword) {
    const data = {
      userID: user.UserID,
      currentPassword,
      newPassword,
    };
    fetch(`${update_password_escalated_matrix}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          window.location = "/manager_level3/index.html";
        }
      });
  } else {
    alert("Confirm Password and New Password did not match");
  }
}

document
  .getElementById("change-password")
  .addEventListener("submit", changePassword);
