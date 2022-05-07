$(".updateEmployee").click(function () {
  // send ajax request to promote employee
  let employeeId = $(this).attr("value");
  let element = $("[value=" + employeeId + "]");

  if (element.text() === "Promote to Manager") {
    $.ajax({
      url: "/manager/promoteEmployee",
      type: "PUT",
      data: {
        employeeId: employeeId,
      },
      success: function (data) {
        if (data === "Employee promoted") {
          // get element with value of employeeId
          element = $("[value=" + employeeId + "]");
          element.text("Demote to Employee");
          let trQuery = `tr[data-employee-id=${employeeId}] `;
          $(trQuery + " .employeeManager").text("Manager");
          // show alert that employee has been promoted for 3 seconds
          $("#alert").removeClass("alert-danger");
          $("#alert").addClass("alert-success");
          $("#alertText").text("Successfully promoted employee to manager.");
          $("#alert").attr("hidden", false);
          setTimeout(function () {
            $("#alert").attr("hidden", true);
          }, 3000);
        } else {
          $("#alert").removeClass("alert-success");
          $("#alert").addClass("alert-danger");
          $("#alertText").text("Internal Server Error");
          $("#alert").attr("hidden", false);
          setTimeout(function () {
            $("#alert").attr("hidden", true);
          }, 3000);
        }
      },
      error: function (err) {
        let data = JSON.parse(err.responseText);
        alert(data.error);
      },
    });
  } else if (element.text() === "Demote to Employee") {
    $.ajax({
      url: "/manager/demoteEmployee",
      type: "PUT",
      data: {
        employeeId: employeeId,
      },
      success: function (data) {
        if (data === "Employee demoted") {
          element = $("[value=" + employeeId + "]");
          element.text("Promote to Manager");
          let trQuery = `tr[data-employee-id=${employeeId}] `;
          $(trQuery + " .employeeManager").text("Employee");
          $("#alert").removeClass("alert-danger");
          $("#alert").addClass("alert-success");
          $("#alertText").text("Successfully demoted manager to employee.");
          $("#alert").attr("hidden", false);
          setTimeout(function () {
            $("#alert").attr("hidden", true);
          }, 3000);
        } else if (data === "redirect to home") {
          window.location.href = "/home";
        } else {
          $("#alert").removeClass("alert-success");
          $("#alert").addClass("alert-danger");
          $("#alertText").text("Internal Server Error, please try again.");
          $("#alert").attr("hidden", false);
          setTimeout(function () {
            $("#alert").attr("hidden", true);
          }, 3000);
        }
      },
      error: function (err) {
        let data = JSON.parse(err.responseText);
        alert(data.error);
      },
    });
  }
});

$("#newEmployee").on("click", async () => {
  // hide the button
  $("#newEmployee").attr("hidden", true);
  // hide the table
  $("#managerDashboarddiv").attr("hidden", true);
  // back to home button
  $("#backToHome").attr("hidden", true);
  // hide search bar
  $("#searchEmployee").attr("hidden", true);
  $("#searchEmployeeLabel").attr("hidden", true);
  // show the form
  $("#newEmployeeForm").removeAttr("hidden");
});

$("#cancelEmployee").on("click", async () => {
  // hide the form
  $("#newEmployeeForm").attr("hidden", true);
  // show the button
  $("#newEmployee").removeAttr("hidden");
  // show the table
  $("#managerDashboarddiv").removeAttr("hidden");
  // check is isbusiness is true
  const isBusiness = $("#isBusiness").val();
  if (!isBusiness) {
    $("#backToHome").attr("hidden", false);
  } else {
    $("#backToHome").attr("hidden", true);
  }
  // show search bar
  $("#searchEmployee").removeAttr("hidden");
  $("#searchEmployeeLabel").removeAttr("hidden");
});

$("#backToHome").on("click", async () => {
  // redirect to the home page
  window.location.href = "/home";
});

// on clicking of enter, filter the table
$("#searchEmployee").on("keyup", function (event) {
  // check if value is empty
  if ($("#searchEmployee").val() === "") {
    // show all employees
    $("#employeesTable tr").attr("hidden", false);
  }
  if (event) {
    // event.keyCode === 13 for enter key
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
  }
});

// onclick of id storeStatus, do ajax request to toggle store status
$("#storeStatus").on("click", function () {
  // send ajax request to toggle store status
  $.ajax({
    url: "/manager/toggleStoreStatus",
    type: "PUT",
    success: function (data) {
      if (data === "Store Opened") {
        // change the text of the button
        $("#storeStatus").text("Close Store");
        // show alert that store has been opened
        $("#alert").removeClass("alert-danger");
        $("#alert").addClass("alert-success");
        $("#alertText").text("Successfully opened store.");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
        }, 3000);
      } else if (data === "Store Closed") {
        $("#employeesTable tr .employeeStatus").text("clockedOut");
        $("#storeStatus").text("Open Store");
        $("#alert").removeClass("alert-danger");
        $("#alert").addClass("alert-success");
        $("#alertText").text("Successfully closed store and clocked out all employees.");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
        }, 3000);
      } else {
        $("#alert").removeClass("alert-success");
        $("#alert").addClass("alert-danger");
        $("#alertText").text("Internal Server Error");
        $("#alert").attr("hidden", false);
        setTimeout(function () {
          $("#alert").attr("hidden", true);
        }, 3000);
      }
    },
    error: function (err) {
      let data = JSON.parse(err.responseText);
      alert(data.error);
    },
  });
});

// // on keyup of search bar, give recommendation to the user
// $("#searchEmployee").on("keyup", function () {
//   var value = $(this).val().toLowerCase();
//   var currentFocus;
// });

// on load of page, get all employees
let employeeNames = [];
$(document).ready(function () {
  // traverse the first column of the table and store the employee names
  $("#employeesTable")
    .find("td:first-child")
    .each(function () {
      employeeNames.push($(this).text());
    });
});

//Ajax for accepting/declining time off requests
$("#timeOffRequestTable").on('click','.updateRequest', function () {
  let objId = $(this).attr("value");
  let element = $(this).attr('id');

  if (element == "timeOffReqAccept") {
    $.ajax({
      url: "/manager/acceptTimeOffRequest",
      type: "PUT",
      data: {
        objId: objId,
      },
      success: function (data) {
        if (data == "Request accepted") {
          // show alert that request had been accepted for 3 seconds
          $("#timeOffRequestTable").load(" #timeOffRequestTable > *");
          $("#timeOffAlertText").text("Successfully accepted request.");
          $("#alertTimeOff").attr("hidden", false);
        } else {
          $("#timeOffAlertText").text("Internal Server Error");
          $("#alertTimeOff").attr("hidden", false);
          setTimeout(function () {
            $("#alertTimeOff").attr("hidden", true);
          }, 3000);
        }
      },
    });
  } else if (element == "timeOffReqDecline") {
    $.ajax({
      url: "/manager/declineTimeOffRequest",
      type: "PUT",
      data: {
        objId: objId,
      },
      success: function (data) {
        if (data === "Request declined") {
          $("#timeOffRequestTable").load(" #timeOffRequestTable > *");
          $("#timeOffAlertText").text("Successfully declined request.");
          $("#alertTimeOff").attr("hidden", false);
        } else {
          $("#timeOffAlertText").text("Internal Server Error, please try again.");
          $("#alertTimeOff").attr("hidden", false);
          setTimeout(function () {
            $("#alertTimeOff").attr("hidden", true);
          }, 3000);
        }
      },
    });
  }
});

$("#timeOffAlertClose").on("click", async () => {
  $("#alertTimeOff").attr("hidden", true);
});