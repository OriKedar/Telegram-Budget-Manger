const BOT = new TelegramBot(
  ScriptProperties.getProperty("botToken"),
  ScriptProperties.getProperty("webAppId"),
  ScriptProperties.getProperty("spreadsheetId"),
  ScriptProperties.getProperty("devList")
);


BOT.addHandler("/thisWeek", "Get your weekly balance ", "commend", thisWeek);
BOT.addHandler("/thisMonth", "Get your monthly balance ", "commend", thisMonth);
BOT.addHandler("/help", "View all commands you can use", "command", help);
BOT.addHandler("/start", "Send a register request", "conversation", {
    entry: newUser,
    states: [
      {type: "addSsid", handler: addSs}

    ],
    final: endRegisterConversation,
    fallback: {
      command: "/cancel",
      handler: cancel
    }
});
BOT.addHandler("/expense", "Add new expense", "conversation", {
  entry: newExpense,
  states: [
    {type: "reason", handler: addReason},
    {type: "amount", handler: addAmount},
    {type: "category", handler: addCategory},
    {type: "method", handler: addMethod},
    {type: "source", handler: addSource}

  ],
  final: endExpenseConversation,
  fallback: {
    command: "/cancel",
    handler: cancel
  }
})

function doPost(e) {
  BOT.dispatcher(JSON.parse(e.postData.contents));
}

function initializeBot() {
  BOT.firstLaunch();
}

function generateEntities(text = "") {
  let count = (text.match(/\//g) || []).length;
  if(count === 0) return null;
  var entities = [];
  var searchFrom = 0;
  for(let i = 0; i < count; i++) {
    var offset = text.indexOf("/", searchFrom);
    var length = text.indexOf(" ", searchFrom);
    entities.push({
      "offset": offset,
      "length": length > -1 ? length : text.length,
      "type": "bot_command"
    })
    searchFrom += length + 1;
  }
  return entities;

};

function doPost(e) {
  BOT.dispatcher(JSON.parse(e.postData.contents));
}

function initializeBot() {
  BOT.firstLaunch();
}

function generateEntities(text = "") {
  let count = (text.match(/\//g) || []).length;
  if(count === 0) return null;
  var entities = [];
  var searchFrom = 0;
  for(let i = 0; i < count; i++) {
    var offset = text.indexOf("/", searchFrom);
    var length = text.indexOf(" ", searchFrom);
    entities.push({
      "offset": offset,
      "length": length > -1 ? length : text.length,
      "type": "bot_command"
    })
    searchFrom += length + 1;
  }
  return entities;
}

function simulateTelegramMessage(text) {
  var firstDev = BOT.devList[0];
  var fromObj = {"id": firstDev, "first_name": "FirstName", "last_name": "LastName", "username": "Username", "language_code": "en", "is_bot": false}
  var chatObj = {"id": firstDev, "first_name": "FirstName", "last_name": "LastName", "username": "Username", "type": "private"}
  return {
    "update_id": 143823073,
    "message": {
      "from": fromObj,
      "chat": chatObj,
      "date": Math.floor(new Date().getTime()/1000),
      "text": text,
      "entities": generateEntities(text)
    }
  } 
}

function testFunction() {
  var contents = simulateTelegramMessage("/help");
  //Logger.log(JSON.stringify(contents, null, 2));
  BOT.dispatcher(contents);
}

function clearMessageSheet() {
  BOT.resetReceivedSheet();
  BOT.resetSentSheet();
}

function clearConversationSheet() {
  BOT.expireConversation();
}