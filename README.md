# Final-Project

The repository for Group 8's Final Project for 2022S CS 546 - Web Programming.

A timekeeping web application with a virtual punch clock built using Node.js and express, with mongodb for storage, bcrypt for encryption, handlebars for layouts, and google charts for visualization

Group members: Peter Rauscher, Joseph Sofia, Harsha Penugonda, Murat Ulu

# Payroll Application for small scale businesses

This application provides an account system and a virtual punch clock for employees in small businesses. Employees can clock in and out while their hours worked are recorded as shifts. Salary is calculated based on the number of hours worked during their shifts, multiplied by their wage.  
Managers can access the Manager Dashboard to view/edit employee information with visualizations powered by Google Charts. They can perform payroll calculations with the push of a button, and also view an estimate of total wages to be paid based on shifts worked so far.  
There are also extra features like the ability for employees to request time off using a form which makes the request appear in the Manager Dashboard for approval. There is a button to mark the business as closed which clocks out active shifts and disables the punch clock. Existing employees can also be promoted to manager status.

# Steps to run the application

1. Install the latest versions of npm and MongoDB

2. Clone the repository
3. Navigate to the folder in a command line and run:
4. `npm ci` (to install the dependencies, according to the package-lock.json file))
5. `npm run seed` (to seed the database)
   - Login information below
6. `npm start` (to start the server)

Open http://localhost:3000/

<br/>

## Default account information (from npm run seed)

### User accounts - main login page

| Employee            | Business Email      | Email              | Password |
| ------------------- | ------------------- | ------------------ | -------- |
| John Doe (manager)  | starbucks@gmail.com | staremp1@gmail.com | staremp1 |
| Jane Smith          | starbucks@gmail.com | staremp2@gmail.com | staremp2 |
| Alex Smith          | starbucks@gmail.com | staremp3@gmail.com | staremp3 |
| Pete Cook (manager) | mcdonalds@gmail.com | macdemp1@gmail.com | macdemp1 |
| John Smith          | mcdonalds@gmail.com | macdemp2@gmail.com | macdemp2 |

<br/>

### Business Accounts - business login page

| Business Email      | Password  |
| ------------------- | --------- |
| starbucks@gmail.com | starbucks |
| mcdonalds@gmail.com | mcdonalds |
| pizzahut@gmail.com  | pizzahut  |

<br />

# Features (Employee Dashboard)

> Employee and manager accounts can access the Employee Dashboard. Business accounts can only view the Manager Dashboard.

## Employee Account Creation

Email of each employee is unique for a particular business. But the same email can be used for multiple businesses. (This is done to consider that fact many people work multiple jobs at the same time.)

## Virtual Punch Clock

Displays the time and "Current status" of the employee:

- Clocked in
- Clocked out
- Meal Break

There is an optional comment text input for every clock punch which shows up when the paychecks are calculated.

- When clocked out, employees can clock in.
- Once clocked in, employees can clock back out, or begin lunch break with "Lunch out" punch
- On meal break, employees can clock back in from lunch with "Lunch in" punch

There is a limit of 1 lunch break per shift.

## Previous Shifts Table

A numbered list of the previously clocked shifts with the most recent ones at the top. A shift is a sequence of clock punches with a clock in and out (lunch clocks are not required). The date of the shift is recorded, as well as the Hours Worked and the Lunch Hours (length of the lunch break).

## Request Time Off

If the employee is not a manager, there will be a table rendered on their homepage alongside a Request Time Off button in which
the employee's already submitted time-off requests will be presented. The Request Time Off button opens a modal window with a form to enter the start and end dates for the request. Upon submission, the request will have a status of pending until a manager
approves or declines the request from the manager dashboard. Only pending requests are visible in the manager dashboard. The
status displayed on the employees home page will be updated according to the managers choice, upon which an employee can delete
their time off request. Employees can delete a request at any point in time.

# Features (Manager Dashboard)

> Business and manager accounts can access the Manager Dashboard.

## View/edit employee information

Employees for the business are displayed in a table with edit and delete buttons, as well as a button for "Promote to Manager/Demote to Employee". From the edit modal, employees can be marked an inactive. This is done using AJAX.

Once an active employee is marked inactive

- If the employee is a manager, they are demoted to an employee
- if the employee is clocked in or in meal break, they are clocked out
- Inactive employees are restricted from using the punch clock.
- managers can inactivate other managers and themselves.

## Delete employee

managers and business owners can delete employees from the dashboard. This is done using AJAX.

- Business owners can delete both employees and managers
- Managers can delete other managers, but not themselves.

## Promote/demote employee

Business owners and managers can promote/demote employees, Promote to Manager/Demote to Employee buttons are displayed in the employee table. This is done using AJAX.

- Only active employees can be promoted to managers.

## Employee Search

There is a search bar which filters the employees in the table by their name.

## Create new employee button

Opens a form for managers and business owners to create new accounts.

## Data visualizations

The charts are powered by the [Google Charts npm package](https://www.npmjs.com/package/google-charts). There is a pie chart displaying the Active status of all employees, and another for their Current Status (Clocked in/out or meal break). Once there are at least 2 previous paycheck calculations, there is also a line chart displaying the total pay over time.  
We chose Google Charts because of its ease of implementation and since a team member has experience using it.

## Time Off Requests

Managers can see all active time off requests in a table with accept and decline buttons. After reviewed, the request is only visible on the employee's dashboard where the employee can then delete the request.

## Store Open/Close button

There is a button to open/close the store. When closed, all active shifts are clocked out and the punch clock is disabled for all employees of the business. This is done using AJAX. employees can only clock in when the store is open.

## Payroll Calculation

There is a button to automatically calculate paychecks for employees. The Past Pay Periods list shows previous calculations, which can be selected to view the full list of paychecks from that calculation.

## Estimate Total Hours and Pay

The estimate button gives an estimate of what the total hours worked and wages paid would be for a payroll calculation based on the shifts that have been worked since the last calculation.
