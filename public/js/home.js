var timeDisplay = document.getElementById("time");

window.onload = displayClock();
function displayClock() {
  var display = new Date().toLocaleTimeString();
  timeDisplay.innerHTML = display;
  setTimeout(displayClock, 1000);
}

const reqTimeOffBttn = document.getElementById("reqTimeOffBttn");
const timeOffModal = document.getElementById("timeOffModal");
const closeTimeOffModal = document.getElementById("closeTimeOffModal");
let timeOffErrorMsg = document.getElementById("timeOffErrorMsg");
let startDate = document.getElementById("timeOffStartDate");
let endDate = document.getElementById("timeOffEndDate");

if (reqTimeOffBttn !== null) {
  reqTimeOffBttn.onclick = function () {
    timeOffModal.style.display = "block";
  };
}

if (closeTimeOffModal !== null) {
  closeTimeOffModal.onclick = function () {
    timeOffModal.style.display = "none";
    startDate.value = "";
    endDate.value = "";
    timeOffErrorMsg.hidden = true;
  };
}

window.onclick = function (event) {
  if (event.target == timeOffModal) {
    timeOffModal.style.display = "none";
    startDate.value = "";
    endDate.value = "";
    timeOffErrorMsg.hidden = true;
  }
};

//Ajax for deleting time off requests
$("#userTimeOffReqTable").on("click", ".deleteTimeOffRequest", function () {
  let objId = $(this).attr("value");
  let element = $(this).attr("id");
  let table = $("#userTimeOffReqTable");

  if (element == "timeOffReqDelete") {
    $.ajax({
      url: "/home/userTimeOffDelete",
      type: "PUT",
      data: {
        objId: objId,
      },
      success: function (data) {
        console.log(data);
        if (data == "Request deleted") {
          table.load(" #userTimeOffReqTable > *");
        }
      },
    });
  }
});

$("#showEmployeeInfo").click(function () {
  $("#employeeInfo").attr("hidden", false);
  $("#showEmployeeInfo").attr("hidden", true);
});

$("#hideEmployeeInfo").click(function () {
  $("#employeeInfo").attr("hidden", true);
  $("#showEmployeeInfo").attr("hidden", false);
});
