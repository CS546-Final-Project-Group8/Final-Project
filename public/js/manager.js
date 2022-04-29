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
