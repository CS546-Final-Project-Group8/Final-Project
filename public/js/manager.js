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
        var element = $("[value='" + employeeId + "']");
        // remove element from DOM
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

// write client side javascript here
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

// on load of page, get all employees
$(document).ready(function () {
  let employeeNames = [];
  // traverse the first column of the table and store the employee names
  $("#employeeTable")
    .find("td:first-child")
    .each(function () {
      employeeNames.push($(this).text());
    });
  console.log(employeeNames);
});
