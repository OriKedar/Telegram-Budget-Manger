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
  const monthlyBudget = getRangeByName(user_id, 'monthlyBuget');
  return monthlyBudget[0][0];
}

function createArrayfromRange(user_id, name) {
  const rawList = getRangeByName(user_id, name);
  var arr
  arr = rawList.filter(item => item[0] !== '');
  console.log(arr)
  return arr;
}

function addNewExpenseRow(reason, amount, category, method, source, payer, user_id){
  const sheet = getSheetByName(user_id, 'Raw');
  let date = new Date();
  let newRow = [date, reason, parseFloat(amount), category, method, source, payer]; 
  sheet.appendRow(newRow);
}

function addMonthlyPayments(user_id){
    let fullSheet = getSheetDataByName(user_id, 'Monthly');
    for (const elment of fullSheet.slice(1)){
      addNewExpenseRow(elment[0], elment[1], elment[2], elment[3], elment[4], elment[5], user_id)
    }
}

function monthlyPaymentToUniqUsers(){
  let usersList = filterDuplicateSheets(getAllUsersData());
      usersList.forEach((elem) => addMonthlyPayments(elem[1]))
}

function testSum() {
getRowsFromLastWeek(645418933)
}
