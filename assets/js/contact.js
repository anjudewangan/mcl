function submiContact(e) {
  e.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const phoneNumber = document.getElementById("phone-number").value;
  const email = document.getElementById("email-address").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  fetch(contact_us_api, {
    method: "POST",
    body: JSON.stringify({
      fullName,
      phoneNumber,
      email,
      subject,
      message,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      alert("Submitted Successfully");
    } else {
      console.log(res);
    }
  });
}

const form = document.getElementById("contact-form");
form.addEventListener("submit", submiContact);
