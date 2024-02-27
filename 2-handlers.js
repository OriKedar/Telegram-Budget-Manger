const EXPENSE_CONVERSATION = Object.freeze({
  ADD_REASON: 0,
  ADD_AMOUNT: 1,
  ADD_CATEGORY: 2,
  ADD_METHOD: 3,
  ADD_SOURCE: 4,
  END: 5
});

const REGISTER_CONVERSATION = Object.freeze({
  ADD_SS: 0,
  END: 1
});


// const start = function(bot, params, message) {
//   bot.sendMessageToActiveUser(message.chat.id, "Hi " + message.from.first_name + "!\nThis is the starting message from the bot, what do you want to do?\n/expense To add new expense \n/thisWeek To see this week expense and balance \n/thisMonth To see this month expense and balance\n/help To see all the commands available use");
// }

const help = function(bot, params, message) {
  var command_descriptions = "Hi " + message.from.first_name + "!\nThis is the list of commands you can use with this bot\n\n";
  for(let command in bot.handlers) {
    command_descriptions += "- " + command + " : <i>" + bot.handlers[command].description + "</i>\n"
  }
  
  bot.sendMessageToActiveUser(message.chat.id, command_descriptions)
}

const thisWeek = function(bot, params, message) {
  const totalWeekSpent = sumRows(getRowsFromLastWeek(message.chat.id));
  const weeklyBudget = getMonthlyBudget(message.chat.id) / 4;
  bot.sendMessageToActiveUser(message.chat.id, `Hi ${message.from.first_name} Your weekly budget is ${weeklyBudget} EUR \nThis week you already used: ${totalWeekSpent} EUR \nYou still have ${weeklyBudget - totalWeekSpent} EUR to spent!`)}

const thisMonth = function(bot, params, message) {
  const totalMonthSpent = sumRows(getRowsFromLastMonth(message.chat.id));
  const monthlyBudget = getMonthlyBudget(message.chat.id);
  bot.sendMessageToActiveUser(message.chat.id, `This month you spent: ${totalMonthSpent} EUR \nYour monthly budget is ${monthlyBudget} EUR \nYou still have ${monthlyBudget - totalMonthSpent} EUR to spent!`);
}

const cancel = function(bot, conversation_data, message) {
  if(typeof conversation_data === 'object' && conversation_data !== null) {
    bot.deleteConversation(conversation_data);
  }
  bot.sendMessageToActiveUser(message.chat.id, "conversation deleted", bot.addReplyKeyboardRemove());
}

const newUser = function(bot, params, message) {
  var chat_id = message.chat.id;

  // if(isUserExsists(chat_id)){
  //   bot.sendMessage(chat_id, "You are alrady registed, If you have any quistion send message to the admins")
  //   if(typeof conversation_data === 'object' && conversation_data !== null) {
  //    bot.deleteConversation(conversation_data);
  //   }
  //   return REGISTER_CONVERSATION.END
  // } else {
  bot.sendMessage(chat_id, "Welcome to the expense bot!\nTo start use the bot please send me the link to your spreadsheet\nTo cancel just use /cancel ")
  return REGISTER_CONVERSATION.ADD_SS
  // }
}

const addSs = function(bot, conversation_data, message) {
  var chat_id = conversation_data.chat_id;
  var url = message.text;
  let parsedSsid = extractSsidFromUrl(url) || `full Url: ${url}`;
  if(isSsIdExists(parsedSsid)){
        try {
    registerNewUser(message.from.first_name, chat_id, parsedSsid);
    } catch (e) {
      Logger.log(e)
      bot.sendMessageToDevs(`error while trying to submit new user \n${e}`);
      bot.sendMessage(chat_id, 'We had a tecnical issue to hendle your request,\nplease try again later.')
      return REGISTER_CONVERSATION.END
    }
    bot.sendMessageToDevs(`New register request from user:\n ${message.from.id} ${message.from.first_name} is trying to register with an existing SSID:\n ${parsedSsid}`)
    bot.sendMessage(chat_id, 'Thank you for registering! \nWe will update you soon!')
    return REGISTER_CONVERSATION.END
  } else {
    try {
    registerNewUser(message.from.first_name, chat_id, parsedSsid);
    } catch (e) {
      Logger.log(e)
      bot.sendMessageToDevs(`error while trying to submit new user \n${e}`);
      bot.sendMessage(chat_id, 'We had a tecnical issue to hendle your request,\nplease try again later.')
      return REGISTER_CONVERSATION.END
    }
    bot.sendMessage(chat_id, 'Thank you for registering, We will process your request and update you!')
    bot.sendMessageToDevs(`Hi Ori, new valid register from ${message.from.first_name} was added to list`)

    return REGISTER_CONVERSATION.END
  }
}

const endRegisterConversation = function(bot, conversation_data, message){
  var chat_id = message.chat.id;
  var name = message.chat.first_name;
}

const newExpense = function(bot, params, message) {
  var chat_id = message.chat.id;
  bot.sendMessageToActiveUser(chat_id, "New expense requested, the new expense will have today's date\nTo cancel just use /cancel\nPlease type the expense reason.");
  return EXPENSE_CONVERSATION.ADD_REASON
}

const addReason = function(bot, conversation_data, message) {
  var chat_id = conversation_data.chat_id;
  bot.sendMessageToActiveUser(chat_id, "Super!\n **Please type the amount of the expense (numbers only) in EUR**");
  return EXPENSE_CONVERSATION.ADD_AMOUNT;
}

const addAmount = function(bot, conversation_data, message) {
  var chat_id = conversation_data.chat_id;
  var amount = message.text;
  if(isNaN(amount)) {
    bot.sendMessageToActiveUser(chat_id, "Please send valid number only")
    return EXPENSE_CONVERSATION.ADD_AMOUNT;
  }
  bot.sendMessageToActiveUser(chat_id, "Amount saved.\nPlease choose the category of the expense" 
  ,bot.addReplyKeyboardMarkup(createArrayFromRange(chat_id, 'expensesCategorys')));
  return EXPENSE_CONVERSATION.ADD_CATEGORY;
}

const addCategory = function (bot, conversation_data, message) {
  var chat_id = conversation_data.chat_id;
  bot.sendMessageToActiveUser(chat_id, "Category saved!", bot.addReplyKeyboardRemove());
  bot.sendMessageToActiveUser(chat_id, "Please choose the payment method that you used", bot.addReplyKeyboardMarkup(createArrayFromRange(chat_id, 'paymentTypes')));
  return EXPENSE_CONVERSATION.ADD_METHOD;
}

const addMethod = function(bot, conversation_data, message) {
  var chat_id = conversation_data.chat_id;
  bot.sendMessageToActiveUser(chat_id, "Payment method saved!", bot.addReplyKeyboardRemove());
  bot.sendMessageToActiveUser(chat_id, "Please choose the source", bot.addReplyKeyboardMarkup(createArrayFromRange(chat_id, 'paymentSources')));
  return EXPENSE_CONVERSATION.ADD_SOURCE;
}

const addSource = function (bot, conversation_data, message) {
  var chat_id = conversation_data.chat_id;
  bot.sendMessageToActiveUser(chat_id, "Payment source saved!", bot.addReplyKeyboardRemove());
  return EXPENSE_CONVERSATION.END;
}

const endExpenseConversation = function(bot, fullPayload, message) {
  var chat_id = message.chat.id;

  var reason = fullPayload.data.find(item => item.type === 'reason')?.value || '';
  var amount = fullPayload.data.find(item => item.type === 'amount')?.value || '';
  var category = fullPayload.data.find(item => item.type === 'category')?.value || '';
  var method = fullPayload.data.find(item => item.type === 'method')?.value || '';
  var source = fullPayload.data.find(item => item.type === 'source')?.value || '';

  try {
  addNewExpenseRow(reason, amount, category, method, source, chat_id);
  } catch (e) {
    Logger.log(`new error while adding new expense ${e}`);
    bot.sendMessageToDevs(`Error while submiting new expense in chat: ${chat_id}\n ${e} `);
    return bot.sendMessageToActiveUser(chat_id, 'We have a tecnical issue to save you expense\nPlease try again.')
  }
  bot.sendMessageToActiveUser(chat_id, `Thank you for adding expense for ${reason}`);
}

const test = function(bot, params, message) {
  bot.sendMessageToActiveUser(message.chat.id, "this is the test" );
}

const remove = function(bot, param, message) {
  bot.sendMessageToActiveUser(message.chat_id, "removing the keyboard", JSON.stringify({remove_keyboard: true}))
}