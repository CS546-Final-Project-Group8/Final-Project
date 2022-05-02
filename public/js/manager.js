$(".promoteEmployee").click(function () {
  // send ajax request to promote employee
  var employeeId = $(this).attr("value");
  $.ajax({
    url: "/manager/promoteEmployee",
    type: "PUT",
    data: {
      employeeId: employeeId,
    },
    success: function (data) {
      if (data === "Employee promoted") {
        // get element with value of employeeId
        var element = $("[value=" + employeeId + "]");
        element.remove();
        // show alert that employee has been promoted for 3 seconds
        $("#alertText").text("Successfully promoted employee to manager.");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
        }, 3000);
      } else {
        $("#alertText").text("Internal Server Error");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
        }, 3000);
      }
    },
  });
});

$("#newEmployee").on("click", async () => {
  // hide the button
  $("#newEmployee").attr("hidden", true);
  // hide the table
  $("#employeesTable").attr("hidden", true);
  // back to home button
  $("#backToHome").attr("hidden", true);
  // hide search bar
  $("#searchEmployee").attr("hidden", true);
  // show the form
  $("#newEmployeeForm").removeAttr("hidden");
});

$("#cancelEmployee").on("click", async () => {
  // hide the form
  $("#newEmployeeForm").attr("hidden", true);
  // show the button
  $("#newEmployee").removeAttr("hidden");
  // show the table
  $("#employeesTable").removeAttr("hidden");
  // check is isbusiness is true
  const isBusiness = $("#isBusiness").val();
  if (!isBusiness) {
    $("#backToHome").attr("hidden", false);
  } else {
    $("#backToHome").attr("hidden", true);
  }
  // show search bar
  $("#searchEmployee").removeAttr("hidden");
});

$("#backToHome").on("click", async () => {
  // redirect to the home page
  window.location.href = "/home";
});

// on change of search bar, filter the table
$("#searchEmployee").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  var table = $("#employeesTable");
  var rows = table.find("tr");

  rows.each(function () {
    // get the name of the employee
    var name = $(this).find("td:first").text().toLowerCase();
    if (name.includes(value)) {
      $(this).attr("hidden", false);
      $("#noEmployeeFound").attr("hidden", true);
    } else {
      $(this).attr("hidden", true);
    }
  });
  // make the header visible
  $("#employeesTableHeader").attr("hidden", false);
  // if no employee is found, display message
  if ($("#employeesTable tr:visible").length === 1) {
    $("#employeesTableHeader").attr("hidden", true);
    $("#noEmployeeFound").attr("hidden", false);
  }
});
