google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawCharts);

function drawActiveEmployeesChart() {
  var data = $.ajax({
    url: "/businesses/getActiveEmployeesData",
    type: "PUT",
    async: false,
  }).responseText;

  var options = {
    title: "Active Employees",
    width: 450,
    height: 300,
  };

  var chart = new google.visualization.PieChart(document.getElementById("piechart"));

  chart.draw(google.visualization.arrayToDataTable(JSON.parse(data)), options);
}

function drawEmployeeStatusChart() {
  var jsondata = $.ajax({
    url: "/businesses/getEmployeeStatusData",
    type: "PUT",
    async: false,
  }).responseText;

  var options = {
    title: "Employees Statuses",
    width: 450,
    height: 300,
  };

  var chart = new google.visualization.PieChart(document.getElementById("piechart2"));

  var data = JSON.parse(jsondata)
  let empCount = data[1][1] + data[2][1] + data[3][1];
  //If there are not 0 employees, draw the chart
  if (empCount !== 0) chart.draw(google.visualization.arrayToDataTable(data), options);
}

function drawHistoricalDataChart() {
  var data = $.ajax({
    url: "/businesses/getHistoricalData",
    type: "PUT",
    async: false,
  }).responseText;

  var options = {
    title: "Previous Total Wages",
    width: 500,
    height: 300,
    legend: { position: "bottom" },
  };

  var chart = new google.visualization.LineChart(document.getElementById("line_chart"));

  //If there is some historical data, draw the chart
  if (data != "") chart.draw(google.visualization.arrayToDataTable(JSON.parse(data)), options);
}

function drawCharts() {
  drawActiveEmployeesChart();
  drawEmployeeStatusChart();
  drawHistoricalDataChart();
}

function refreshPieCharts() {
  drawActiveEmployeesChart();
  drawEmployeeStatusChart();
}

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
  if (isBusiness === "false") {
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
        drawEmployeeStatusChart();
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

//Ajax for accepting/declining time off requests
$("#timeOffRequestTable").on("click", ".updateRequest", function () {
  let objId = $(this).attr("value");
  let element = $(this).attr("id");

  if (element == "timeOffReqAccept") {
    $.ajax({
      url: "/manager/acceptTimeOffRequest",
      type: "PUT",
      data: {
        objId: objId,
      },
      success: function (data) {
        if (data == "Request accepted") {
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
      error: function (err) {
        let data = JSON.parse(err.responseText);
        alert(data.error);
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
      error: function (err) {
        let data = JSON.parse(err.responseText);
        alert(data.error);
      },
    });
  }
});

$("#timeOffAlertClose").on("click", async () => {
  $("#alertTimeOff").attr("hidden", true);
});

$("#estimateAlertClose").on("click", async () => {
  $("#estimate").attr("hidden", true);
});

// onclick of estimate button, do ajax request to get estimated total paycheck amounts
$("#estimateButton").on("click", function () {
  // send ajax request to get estimate
  $.ajax({
    url: "/manager/estimateWages",
    type: "PUT",
    success: function (data) {
      if (data !== "") {
        $("#estimateText").text(data);
      } else {
        $("#estimateText").text("Estimate failed.");
      }
      $("#estimate").attr("hidden", false);
    },
    error: function (err) {
      let data = JSON.parse(err.responseText);
      alert(data.error);
    },
  });
});
