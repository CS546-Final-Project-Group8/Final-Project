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
        element.text("Demote as Employee");
        // show alert that employee has been promoted for 3 seconds
        $("#alertText").text("Successfully promoted employee to manager.");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
          location.reload();
        }, 1000);
      } else {
        $("#alertText").text("Internal Server Error");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
        }, 1000);
      }
    },
  });
});

// write logic for demote employee here
$(".demoteEmployee").click(function () {
  var employeeId = $(this).attr("value");
  $.ajax({
    url: "/manager/demoteEmployee",
    type: "PUT",
    data: {
      employeeId: employeeId,
    },
    success: function (data) {
      if (data === "Employee demoted") {
        var element = $("[value=" + employeeId + "]");
        element.text("Promote as Manager");
        $("#alertText").text("Successfully demoted employee.");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
          // reload page
          location.reload();
        }, 1000);
      } else if (data === "redirect to home") {
        window.location.href = "/home";
      } else {
        $("#alertText").text("Internal Server Error, please try again.");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
          location.reload();
        }, 1000);
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
    } else {
      $(this).attr("hidden", true);
    }
  });
  // make the header visible
  $("#employeesTableHeader").attr("hidden", false);
  // if no employee is found, display message
  if ($("#employeesTable tr:visible").length === 1) {
    $("#noEmployeeFound").attr("hidden", false);
  } else {
    $("#noEmployeeFound").attr("hidden", true);
  }
});
