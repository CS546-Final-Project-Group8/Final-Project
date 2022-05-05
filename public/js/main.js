// javascript code for main page
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
    const gender = $("#editGender");
    gender.find("option").each(function () {
      if ($(this).val().toLowerCase() === employee.gender.toLowerCase()) {
        $(this).attr("selected", true);
      }
    });
    $("#editAddress").val(employee.address);
    $("#editCity").val(employee.city);
    $("#editState").val(employee.state);
    $("#editZip").val(employee.zip);
    $("#editPhoneNumber").val(employee.phone);
    // find relevent option for employment Status from select
    const employmentStatus = $("#editEmploymentStatus");
    employmentStatus.find("option").each(function () {
      if ($(this).val().toLowerCase() === employee.employmentStatus.toLowerCase()) {
        $(this).attr("selected", true);
      }
    });
    const isActiveEmployee = $("#editIsActiveEmployee");
    isActiveEmployee.find("option").each(function () {
      if ($(this).val().toLowerCase() == employee.isActiveEmployee) {
        $(this).attr("selected", true);
      }
    });
    $("#editHourlyPay").val(employee.hourlyPay);
    $("#editStartDate").val(employee.startDate);
    $("#editIsManager").val(employee.isManager.toString());
  });
});

$("#cancelEditEmployee").on("click", async (event) => {
  event.preventDefault();
  $("#editEmployeeModal").hide();
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
      if (data === "You cannot delete yourself") {
        $("#deleteEmployeeModal").hide();
        alert(data);
      } else if (data.error) {
        $("#deleteEmployeeModal").hide();
        alert(data.error);
      } else {
        $(`tr[employee-id=${employeeId}]`).remove();
        $("#deleteEmployeeModal").attr("employee-id", "");
        $("#deleteEmployeeModal").hide();
        // check if there are no employees left
        if ($("#employeesTable tr").length === 1) {
          $("#noEmployeeFound").attr("hidden", false);
        }
      }
    })
    .fail((req, status, error) => {
      console.log(error);
    });
});

$("#backToHome").on("click", async () => {
  // redirect to the home page
  window.location.href = "/home";
});
