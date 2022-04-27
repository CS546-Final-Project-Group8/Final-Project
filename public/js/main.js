// write client side javascript here
$("#newEmployee").on("click", async () => {
  // hide the button
  $("#newEmployee").hide();
  // hide the table
  $("#employeesTable").hide();
  // back to home button
  $("#backToHome").hide();
  // show the form
  $("#newEmployeeForm").removeAttr("hidden");
});

$("#cancelEmployee").on("click", async () => {
  // hide the form
  $("#newEmployeeForm").attr("hidden", true);
  // show the button
  $("#newEmployee").show();
  // show the table
  $("#employeesTable").show();
  // check is isbusiness is true
  const isBusiness = $("#isBusiness").val();
  if (!isBusiness) {
    $("#backToHome").show();
  } else {
    $("#backToHome").hide();
  }
});

$("#backToHome").on("click", async () => {
  // redirect to the home page
  window.location.href = "/home";
});
