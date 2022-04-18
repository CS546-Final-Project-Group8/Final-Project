// write client side javascript here
$("#newEmployee").on("click", async () => {
  // show the form
  $("#newEmployeeForm").show();
  // hide the button
  $("#newEmployee").hide();
  // hide the table
  $("#employeesTable").hide();
  $("#backToHome").hide();
});

$("#cancelEmployee").on("click", async () => {
  // hide the form
  $("#newEmployeeForm").hide();
  // show the button
  $("#newEmployee").show();
  // show the table
  $("#employeesTable").show();
  $("#backToHome").show();
});

$("#backToHome").on("click", async () => {
  // redirect to the home page
  window.location.href = "/";
});
