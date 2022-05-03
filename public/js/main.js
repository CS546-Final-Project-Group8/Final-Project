// write client side javascript here
$("#newEmployee").on("click", async () => {
  // hide the button
  $("#newEmployee").hide();
  // hide the table
  $("#employeesTable").hide();
  // back to home button
  $("#backToHome").hide();
  // show the form
  $("#newEmployeeForm").removeAttr("hidden");
});

$("#cancelEmployee").on("click", async () => {
  // hide the form
  $("#newEmployeeForm").attr("hidden", true);
  // show the button
  $("#newEmployee").show();
  // show the table
  $("#employeesTable").show();
  // check is isbusiness is true
  const isBusiness = $("#isBusiness").val();
  if (!isBusiness) {
    $("#backToHome").show();
  } else {
    $("#backToHome").hide();
  }
});

$(document).on("click", ".editEmployee", async function (event) {
  event.preventDefault();
  $("#editEmployeeModal").show();
  console.log($(this));
  let employeeId = $(this).attr("employee-id");
  // TODO use client side validation to check the employee id
  $.ajax({
    url: `manager/employee/${employeeId}`,
    type: "GET",
  }).done((data) => {
    if (data.error) console.log("Error getting employee while editing: ", data.error);
    const employee = data;
    $("#editEmployeeModal").attr("employee-id", employeeId);
    $("#editEmail").val(employee.email);
    $("#editFirstName").val(employee.firstName);
    $("#editLastName").val(employee.lastName);
    $("#editGender").val(employee.gender);
    $("#editAddress").val(employee.address);
    $("#editCity").val(employee.city);
    $("#editState").val(employee.state);
    $("#editZip").val(employee.zip);
    $("#editPhoneNumber").val(employee.phone);
    $("#editEmploymentStatus").val(employee.employmentStatus);
    $("#editIsActiveEmployee").val(employee.isActiveEmployee);
    $("#editHourlyPay").val(employee.hourlyPay);
    $("#editStartDate").val(employee.startDate);
    $("#editIsManager").val(employee.isManager.toString());
  });
});

$("#cancelEditEmployee").on("click", async (event) => {
  event.preventDefault();
  $("#editEmployeeModal").hide();
});

$("#saveEditEmployee").on("click", async (event) => {
  event.preventDefault();
  let employeeId = $("#editEmployeeModal").attr("employee-id");
  // TODO client side validation goes here BEFORE patching
  $.ajax({
    url: `manager/employee/${employeeId}`,
    type: "PATCH",
    data: {
      email: $("#editEmail").val(),
      firstName: $("#editFirstName").val(),
      lastName: $("#editLastName").val(),
      gender: $("#editGender").val(),
      address: $("#editAddress").val(),
      city: $("#editCity").val(),
      state: $("#editState").val(),
      zip: $("#editZip").val(),
      phoneNumber: $("#editPhoneNumber").val(),
      employmentStatus: $("#editEmploymentStatus").val(),
      isActiveEmployee: $("#editIsActiveEmployee").val(),
      hourlyPay: $("#editHourlyPay").val(),
      startDate: $("#editStartDate").val(),
      isManager: $("#editIsManager").val(),
    },
  })
    .done((data) => {
      if (data.error) console.log("Error updating employee: ", data.error);
      else {
        let trQuery = `tr[employee-id=${employeeId}] `;
        $(trQuery + " .employeeName").text(data.firstName + " " + data.lastName);
        $(trQuery + " .employeeStatus").text(data.currentStatus);
        $(trQuery + " .employeeEmail").text(data.email);
        $(trQuery + " .employeePhone").text(data.phone);
        $(trQuery + " .employeeAddress").text(`${data.address}, ${data.city} ${data.state}, ${data.zip}`);
        $(trQuery + " .employeeGender").text(data.gender);
        $(trQuery + " .employeeHourlyPay").text("$" + data.hourlyPay);
        $(trQuery + " .employeeEmployment").text(data.employmentStatus);
        $(trQuery + " .employeeActive").text(data.isActiveEmployee === "true" ? "Yes" : "No");
        const startDate = new Date(data.startDate);
        $(trQuery + " .employeeStart").text(startDate.toLocaleDateString("en-US"));
        $(trQuery + " .employeeManager").text(data.isManager ? "Manager" : "Employee");
        $("#editEmployeeModal").hide();
      }
    })
    .fail((req, status, error) => console.log(error));
});

$(document).on("click", ".deleteEmployee", async function (event) {
  event.preventDefault();
  $("#deleteEmployeeModal").attr("employee-id", $(this).attr("employee-id"));
  $("#deleteEmployeeModal").show();
});

$("#cancelDeleteEmployee").on("click", async function (event) {
  event.preventDefault();
  $("#deleteEmployeeModal").attr("employee-id", "");
  $("#deleteEmployeeModal").hide();
});

$("#confirmDeleteEmployee").on("click", async function (event) {
  event.preventDefault();
  let employeeId = $("#deleteEmployeeModal").attr("employee-id");
  // TODO client-side validation HERE
  $.ajax({
    url: `manager/employee/${employeeId}`,
    type: "DELETE",
  })
    .done((data) => {
      if (data.error) console.log("Error deleting employee: ", data.error);
      else {
        $(`tr[employee-id=${employeeId}]`).remove();
        $("#deleteEmployeeModal").attr("employee-id", "");
        $("#deleteEmployeeModal").hide();
      }
    })
    .fail((req, status, error) => console.log(error));
});

$("#backToHome").on("click", async () => {
  // redirect to the home page
  window.location.href = "/home";
});
