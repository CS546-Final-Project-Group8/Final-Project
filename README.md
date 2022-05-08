# Final-Project #

The repository for Group 8's Final Project for 2022S CS 546 - Web Programming.

Group members: Peter Rauscher, Joseph Sofia, Harsha Penugonda, Murat Ulu

# Payroll Application for small scale businesses. #

This application provides an account system and a virtual punch clock for employees in small businesses. Employees can clock in and out while their hours worked are recorded as shifts. Salary is calculated based on the number of hours worked during their shifts, multiplied by their wage.  
Managers can access the Manager Dashboard to view/edit employee information with visualizations powered by Google Charts. They can perform payroll calculations with the push of a button, and also view an estimate of total wages to be paid based on shifts worked so far.  
There are also extra features like ability for employees to request time off using a form, which makes the request appear in the Manager Dashboard for approval. There is a button to mark the business as closed which clocks out active shifts and disables the punch clock. Existing employees can also be promoted to manager status.

# Steps to run the application #

0. Install the latest versions of npm and MongoDB

1. Clone the repository
2. Navigate to the folder in a command line and run:
3. ```npm ci``` (to install the dependencies)
4. ```npm run seed``` (to seed the database)  
    * Login information below
5. ```npm start``` (to start the server)

Open http://localhost:3000/

<br/>

## Default account information (from npm run seed) ##
### User accounts - main login page ###
Employee              | Business Email        | Email               | Password
--------------------- | --------------------- | ------------------- | -------------
John Doe (manager)    | starbucks@gmail.com   | staremp1@gmail.com  | staremp1
Jane Smith            | starbucks@gmail.com   | staremp2@gmail.com  | staremp2
Alex Smith            | starbucks@gmail.com   | staremp3@gmail.com  | staremp3
Pete Cook (manager)   | mcdonalds@gmail.com   | macdemp1@gmail.com  | macdemp1
John Smith            | mcdonalds@gmail.com   | macdemp2@gmail.com  | macdemp2

<br/>

### Business Accounts - business login page ###
Business Email         | Password
---------------------- | --------------
starbucks@gmail.com    | starbucks
mcdonalds@gmail.com    | mcdonalds
pizzahut@gmail.com     | pizzahut

<br />

# Features (Employee Dashboard) #
>Employee and manager accounts can access the Employee Dashboard. Business accounts can only view the Manager Dashboard.
## Virtual Punch Clock ##
Displays the time and "Current status" of the employee:
* Clocked in
* Clocked out
* Meal Break

There is an optional comment text input for every clock punch which shows up when the paychecks are calculated.  
* When clocked out, employees can clock in.  
* Once clocked in, employees can clock back out, or begin lunch break with "Lunch out" punch
* On meal break, employees can clock back in from lunch with "Lunch in" punch

There is a limit of 1 lunch break per shift.

## Previous Shifts Table ##
A numbered list of the previously clocked shifts with the most recent ones at the top. A shift is a sequence of clock punches with a clock in and out (lunch clocks are not required). The date of the shift is recorded, as well as the Hours Worked and the Lunch Hours (length of the lunch break).

## Request Time Off ##
If the employee is not a manager, they can view their Time Off Requests and create new requests with the Request Time Off button. This opens a modal window with a form to enter the dates for the request. It then shows up on the list and managers can approve/reject the request from the dashboard.

# Features (Manager Dashboard)
>Business and manager accounts can access the Manager Dashboard.

## Employee Management: ##

## View/edit employee information ## 
Employees for the business are displayed in a table with edit and delete buttons, as well as a button for "Promote to Manager/Demote to Employee". From the edit modal, employees can be marked an inactive which prevents them from using the punch clock. This is done using AJAX.

## Employee Search ##
There is a search bar which filters the employees in the table by their name.

## Create new employee button ##
Opens a modal with a form for managers to create new accounts for employees.

## Data visualizations ##
The charts are powered by the [Google Charts npm package](https://www.npmjs.com/package/google-charts). There is a pie chart displaying the Active status of all employees, and another for their Current Status (Clocked in/out or meal break). Once there are at least 2 previous paycheck calculations, there is also a line chart displaying the total pay over time.  
We chose Google Charts because of its ease of implementation and since a team member has experience using it.

## Time Off Requests ##
Managers can see all active time off requests in a table with accept and reject buttons. After reviewed, the request is only visible on the employee's dashboard where they can delete the request.

## Store Open/Close button ##
There is a button to open/close the store. When closed, all active shifts are clocked out and the punch clock is disabled for all employees of the business.

## Payroll Calculation ##
There is a button to automatically calculate paychecks for employees. The Past Pay Periods list shows previous calculations, which can be selected to view the full list of paychecks from that calculation.

## Estimate Total Hours and Pay ##
The estimate button gives an estimate of what the total hours worked and wages paid would be for a payroll calculation based on the shifts that have been worked since the last calculation.