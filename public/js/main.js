$(document).on("click", ".deleteEmployee", async function (event) {
  event.preventDefault();
  $("#deleteEmployeeModal").attr("data-employee-id", $(this).attr("data-employee-id"));
  $("#deleteEmployeeModal").show();
  drawActiveEmployeesChart();
});

$("#cancelDeleteEmployee").on("click", async function (event) {
  event.preventDefault();
  $("#deleteEmployeeModal").attr("data-employee-id", "");
  $("#deleteEmployeeModal").hide();
});

$("#confirmDeleteEmployee").on("click", async function (event) {
  event.preventDefault();
  let employeeId = $("#deleteEmployeeModal").attr("data-employee-id");
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
        $(`tr[data-employee-id=${employeeId}]`).remove();
        $("#deleteEmployeeModal").attr("data-employee-id", "");
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
