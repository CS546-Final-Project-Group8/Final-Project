// write client side javascript here
$("#newEmployee").on("click", async () => {
  // show the form
  $("#newEmployeeForm").show();
  // hide the button
  $("#newEmployee").hide();
  // hide the table
  $("#employeesTable").hide();
});

$("#cancelEmployee").on("click", async () => {
  // hide the form
  $("#newEmployeeForm").hide();
  // show the button
  $("#newEmployee").show();
  // show the table
  $("#employeesTable").show();
});
