function getSheetDataByName(user_id ,name){
  let ssId = getSpreadSheetByUserId(user_id);
  const ss = SpreadsheetApp.openById(ssId);
  const sheet = ss.getSheetByName(name);
  return sheet.getDataRange().getValues();
}

function getSheetByName(user_id, name) {
  let ssId = getSpreadSheetByUserId(user_id);
  const ss = SpreadsheetApp.openById(ssId);
  return ss.getSheetByName(name)
}

function getRangeByName(user_id, name) {
  let ssId = getSpreadSheetByUserId(user_id);
  const ss = SpreadsheetApp.openById(ssId);
  const range = ss.getRangeByName(name);
  return range.getValues();
}

function getRowsFromLastXDays(user_id, days) {
  var data = getSheetDataByName(user_id, 'Raw');
  
  var today = new Date();
  var daysAgo = new Date(today);
  daysAgo.setDate(today.getDate() - days);
  
  var filteredRows = data.filter(function(row) {
    var rowDate = new Date(row[0]); // Assuming your date is in the first column (adjust as needed)
    return rowDate >= daysAgo && rowDate <= today;
  });

  return filteredRows;
}

function getRowsFromLastWeek(user_id){
  var data = getSheetDataByName(user_id, 'Raw');

  var today = new Date();
  var prevMonday = new Date();
  prevMonday.setHours(0,0,0,0);
  prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);

  var filteredRows = [];

  for (var i = 0; i < data.length; i++) {
    var rowDate = data[i][0];

    if (isValidDate(data[i][0])) {
      if (rowDate >= prevMonday && rowDate <= today) {
        filteredRows.push(data[i]);
      }
    } else {
      console.warn('Invalid date:', data[i][0]);
    }
  }
  return filteredRows
}

function sumRows(filteredRows){
  var sum = 0; 
  for (var i = 0; i < filteredRows.length; i++) {
  sum += filteredRows[i][2]; 
  }
  return sum.toFixed(2)
}

function getRowsByDate(user_id, start_date){
  var data = getSheetByName(user_id, 'Raw');

  var today = new Date();
  var filteredRows = []


  for (var i = 0; i < data.length; i++) {
    var rowDate = data[i][0];

    if (isValidDate(data[i][0])) {
      if (rowDate >= start_date && rowDate <= today) {
        filteredRows.push(data[i]);
      }
    } else {
      console.warn('Invalid date:', data[i][0]);
    }
  }
  return filteredRows
}

function getRowsFromLastMonth(user_id) {
  var data = getSheetDataByName(user_id, 'Raw');

  var today = new Date();
  var startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1,0,0,0,0)
  var filteredRows = [];

  for (var i = 0; i < data.length; i++) {
    var rowDate = data[i][0];

    if (isValidDate(data[i][0])) {
      if (rowDate >= startOfMonth && rowDate <= today) {
        filteredRows.push(data[i]);
      }
    } else {
      console.warn('Invalid date:', data[i][0]);
    }
  }
  return filteredRows
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

function getMonthlyBudget(user_id){
  const monthlyBudget = getRangeByName(user_id, 'monthlyBudget');
  return monthlyBudget[0][0];
}

function createArrayFromRange(user_id, name) {
  const rawList = getRangeByName(user_id, name);
  var arr
  arr = rawList.filter(item => item[0] !== '');
  console.log(arr)
  return arr;
}

function addNewExpenseRow(reason, amount, category, method, source, user_id){
  const sheet = getSheetByName(user_id, 'Raw');
  let date = new Date();
  let newRow = [date, reason, parseFloat(amount), category, method, source]; 
  sheet.appendRow(newRow);
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function addMonthlyPayments(user_id){
    let fullSheet = getSheetDataByName(user_id, 'Monthly');
    for (const element of fullSheet.slice(1)){
      addNewExpenseRow(element[0], element[1], element[2], element[3], element[4], user_id)
    }
}

function monthlyPaymentToUniqueUsers(){
  let usersList = filterDuplicateSheets(getAllUsersData());
      usersList.forEach((elem) => addMonthlyPayments(elem[1]))
}

function testSum() {
getWeekllyStatics(645418933)
}
