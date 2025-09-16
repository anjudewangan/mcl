let user = JSON.parse(localStorage.getItem("user"));
let userName = user.Name;
let EIS = user.EIS;
let QR_No = user.Qr;
let colony = user.COLONY;
let area = user.AREA;
let department = user.DEPT;
let conatact = user.Contact;
let designation = user.Designation;

document.getElementById("employeeName").innerHTML = userName;
document.getElementById("EIS_NO").innerHTML = EIS;
document.getElementById("QR").innerHTML = QR_No;
document.getElementById("e_colony").innerHTML = colony;
document.getElementById("area").innerHTML = area;
document.getElementById("department").innerHTML = department;
document.getElementById("e_contact").innerHTML = conatact;
document.getElementById("Designation").innerHTML = designation;

const getColonyOptionsHtml = () => {
  return new Promise((resolve, reject) => {
    fetch(`${baseUrl}/colony`)
      .then((res) => {
        if (res.status === 402) {
          window.location = "../../../index.html";
        }
        return res.json();
      })
      .then((data) => {
        let colonyOptionListHtml = `<option selected value="${colony}">${colony}</option>`;
        data.map((value) => {
          colonyOptionListHtml += `<option value="${value.Area}">${value.Area}</option>`;
        });
        resolve(colonyOptionListHtml);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const submitChangeRequest = (e) => {
  e.preventDefault();
  const formData = new FormData(document.forms.changeRequest);
  const body = {
    ...user,
    Qr: formData.get("qr_no"),
    COLONY: formData.get("colony"),
    AREA: formData.get("area"),
    DEPT: formData.get("department"),
    Contact: formData.get("contact"),
    Designation: formData.get("designation"),
    // ...user,
  };
  console.log(
    "🚀 ~ file: employeeProfile.js:49 ~ submitChangeRequest ~ body:",
    body
  );
  fetch(`${baseUrl}/update-employee`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 402) {
      window.location = "../../../index.html";
    }
    location.reload();
  });
};

const showChangeRequest = async (e) => {
  const colonyOptionListHtml = await getColonyOptionsHtml();
  html = `<div class="modal-body">
                                    <div class="row mb-3">
                                        <div class="col-sm-6">
                                            <label for="" class="form-label">Qr. No.</label>
                                            <input type="text" value="${QR_No}" name="qr_no" class="form-control" id="" placeholder="Qr. No.">
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="" class="form-label">Colony</label>
                                            <!-- <input type="text" value="Rajtilak" class="form-control"> -->
                                            <select class="form-select" name="colony" aria-label="Default select example" required>
                                                ${colonyOptionListHtml}
                                            </select>
                                        </div>
                                    </div>
                                    <div class="row mb-3">
                                    <div class="col-sm-6">
                                            <label for="" class="form-label">Area</label>
                                            <input type="text" class="form-control" id="" name="area" value="${area}" placeholder="Area">
                                    </div>
                                    <div class="col-sm-6">
                                        <label for="" class="form-label">Contact</label>
                                        <input type="number" class="form-control" id="" name="contact" value="${conatact}" placeholder="Contact">
                                    </div>
                                    </div>
                                    <div class="row mb-3">
                                        <div class="col-sm-6">
                                            <label for="" class="form-label">Department</label>
                                            <input type="text" class="form-control" id="" name="department" value="${department}" placeholder="Department">
                                        </div>
                                        <div class="col-sm-6">
                                            <label for="" class="form-label">Designation</label>
                                            <input type="text" class="form-control" id="" name="designation" value="${designation}" placeholder="Designation">
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer d-flex justify-content-between">
                                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-success">Request Change</button>
                                </div>`;
  document.getElementById("changeRequest").innerHTML = html;
  document
    .getElementById("changeRequest")
    .addEventListener("submit", submitChangeRequest);
};

document
  .getElementById("showChangeRequest")
  .addEventListener("click", showChangeRequest);
