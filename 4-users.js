
function getSpreadSheetByUserId (user_id) {
  const ss = SpreadsheetApp.openById(ScriptProperties.getProperty('spreadsheetId'))
  const usersSheet = ss.getSheetByName('users');
  let row = usersSheet.createTextFinder(user_id).findNext().getRowIndex();
  return usersSheet.getRange(row, 3).getValue();
}

function getAllUsersData () {
  const ss = SpreadsheetApp.openById(ScriptProperties.getProperty('spreadsheetId'))
  const usersSheet = ss.getSheetByName('users');
  let usersList = usersSheet.getDataRange().getValues();
  usersList.shift()
  return usersList
}

function filterActiveUsers(usersArray){
  let activeUsers = usersArray.filter(arr => {
    if(arr[3]){
      return true
    }
    return false
  })

  return activeUsers
}

function filterDuplicateSheets(dataArray) {
  let uniqueStrings = new Set();
  let filteredArray = dataArray.filter(arr => {
    let currentString = arr[2];
    if (!uniqueStrings[currentString]) {
      uniqueStrings[currentString] = true;
      return true;
    }
    return false;
  });

  return filteredArray;
}

function registerNewUser(name, user_id, spreedSheetId, isActive = 'false'){
  const ss = SpreadsheetApp.openById(ScriptProperties.getProperty('spreadsheetId'))
  const sheet = ss.getSheetByName('users');
  let newRow = [name, user_id, spreedSheetId, isActive]
  sheet.appendRow(newRow)
}

function getActiveUsersIds(){
    let activeUsers = filterActiveUsers(getAllUsersData());
    let userIds = []
    activeUsers.forEach((user) => {
      userIds.push(user[1])
    })
    return userIds
}

function getAllUsersIds(){
    let users =  getAllUsersData();
    let userIds = []
    users.forEach((user) => {
      userIds.push(user[1])
    })
    return userIds
}

function getAllSsids(){
  let users =  getAllUsersData();
  let usersSsids = []
  users.forEach((user) => {
    usersSsids.push(user[2])
  })
  return usersSsids
}

function isUserExists(user_id){
  let usersList = getAllUsersIds()
  return usersList.includes(user_id);
}

function isSsIdExists(ssid){
  let ssIds = getAllSsids()
  return ssIds.includes(ssid)
}

function extractSsidFromUrl(fullUrl) {
  const match = fullUrl.match(/\/d\/([^/]+)/);
  return match ? match[1] : null;
}

function updateActiveUsersList(){
  BOT.updateActiveUsersList()
}

function testusers () {
}