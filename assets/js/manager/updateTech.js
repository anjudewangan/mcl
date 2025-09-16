let updateIndexValue = JSON.parse(localStorage.getItem("updateIndexValue"));
let formData = ``;
fetch(addTech_api)
  .then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    return res.json();
  })
  .then((data) => {
    data.map((value, index) => {
      if (index == updateIndexValue) {
        console.log(value);
        formData = `<div class="row g-2">
                <div class="col-md-6">
                    <label class="control-label">Name</label>
                    <input class="form-control" id="techName" type="text"
                        value="${value.Name}" required="required">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please select a valid name.
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="control-label">Contact</label>
                    <input class="form-control" id="contact" type="number"
                        value="${value.Contact}">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please select a valid contact.
                    </div>
                </div>
            </div>
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label class="control-label">Email ID</label>
                    <input class="form-control" id="emailId" type="email"
                        value="${value.Email_Id}">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Please provide a valid email id.
                    </div>
                </div>

            
            </div>
            <button class="btn btn-success" type="submit">Update</button>`;
      }
    });
    document.getElementById("updateForm").innerHTML = formData;
    document
      .getElementById("updateForm")
      .addEventListener("submit", updateTechnician);
  });

function updateTechnician(e) {
  e.preventDefault();
  let name = document.getElementById("techName").value;
  let email = document.getElementById("emailId").value;
  let Contact = document.getElementById("contact").value;
  const result1 = new Date().toLocaleDateString("en-GB");
  console.log({ name, email, Contact, result1 });
  fetch(addTech_api)
    .then((res) => {
      if (res.status === 402) {
        window.location = "../../../index.html";
      }
      return res.json();
    })
    .then((data) => {
      data.map((value, index) => {
        if (index == updateIndexValue) {
          path2show = addTech_api + "/" + `${value._id}`;
          fetch(path2show, {
            method: "PATCH",
            body: JSON.stringify({
              Name: name,
              Contact: Contact,
              Email_Id: email,
              Date: result1,
            }),
            headers: {
              "Content-type": "application/json",
            },
          }).then((res) => {
            if (res.status === 402) {
              window.location = "../../../index.html";
            }
            alert("successfully updated");
            window.location.replace("./viewTechnician.html");
          });
        }
      });
    });
}
