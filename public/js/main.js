$(document).on("click", ".deleteEmployee", async function (event) {
  event.preventDefault();
  $("#deleteEmployeeModal").attr("data-employee-id", $(this).attr("data-employee-id"));
  $("#deleteEmployeeModal").show();
});

$("#cancelDeleteEmployee").on("click", async function (event) {
  event.preventDefault();
  $("#deleteEmployeeModal").attr("data-employee-id", "");
  $("#deleteEmployeeModal").hide();
});

$("#confirmDeleteEmployee").on("click", async function (event) {
  event.preventDefault();
  let employeeId = $("#deleteEmployeeModal").attr("data-employee-id");
  $.ajax({
    url: `manager/employee/${employeeId}`,
    type: "DELETE",
  })
    .done((data) => {
      if (data === "You cannot delete yourself") {
        $("#deleteEmployeeModal").hide();
        alert(data);
      } else {
        $(`tr[data-employee-id=${employeeId}]`).remove();
        $("#deleteEmployeeModal").attr("data-employee-id", "");
        $("#deleteEmployeeModal").hide();
        // check if there are no employees left
        if ($("#employeesTable tr").length === 1) {
          $("#noEmployeeFound").attr("hidden", false);
        }
      }
      drawActiveEmployeesChart();
    })
    .fail((error) => {
      let data = JSON.parse(error.responseText);
      $("#deleteEmployeeModal").hide();
      alert(data.error);
    });
});

$("#backToHome").on("click", async () => {
  // redirect to the home page
  window.location.href = "/home";
});
