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
