var timeDisplay = document.getElementById("time");

window.onload = displayClock();
function displayClock() {
  var display = new Date().toLocaleTimeString();
  timeDisplay.innerHTML = display;
  setTimeout(displayClock, 1000);
}

$("#showEmployeeInfo").click(function () {
  $("#employeeInfo").attr("hidden", false);
  $("#showEmployeeInfo").attr("hidden", true);
});

$("#hideEmployeeInfo").click(function () {
  $("#employeeInfo").attr("hidden", true);
  $("#showEmployeeInfo").attr("hidden", false);
});
