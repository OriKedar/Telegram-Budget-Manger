function getWeekllyUsage(user_id){
  const budget = getMonthlyBudget(user_id) / 4; 
  const totalWeekSpent = roundToTwo(sumRows(getRowsFromLastWeek(user_id)));
  const userCurrency = getUserCurrency(user_id);

  if (budget - totalWeekSpent >= 0){
    return `Your weekly budget is ${budget} ${userCurrency} \nThis week you already used: ${totalWeekSpent} ${userCurrency} \nYou still have ${roundToTwo(budget - totalWeekSpent)} ${userCurrency} to spent!`
  } else if (budget - totalWeekSpent < 0){
    return `Oh no... \nYour weekly budget is ${budget} ${userCurrency} \nThis week you already used: ${totalWeekSpent} ${userCurrency} \nYou exceeded by ${roundToTwo(totalWeekSpent - budget)} ${userCurrency}`
  }
}

function getMonthlyUsage(user_id){
  const budget = getMonthlyBudget(user_id);
  const totalMonthSpent = roundToTwo(sumRows(getRowsFromLastMonth(user_id)));
  const userCurrency = getUserCurrency(user_id);

  if (budget - totalMonthSpent >= 0){
    return `Your monthly budget is ${budget} ${userCurrency}, you used ${totalMonthSpent} ${userCurrency} \nYou still have ${roundToTwo(budget - totalMonthSpent)} ${userCurrency} to Spent!`
  } else if (budget - totalMonthSpent < 0){
    return `Oh no... \nYour monthly budget is ${budget} ${userCurrency}, you used ${totalMonthSpent} ${userCurrency} \nYou exceeded by ${roundToTwo(totalMonthSpent - budget)} ${userCurrency}`
  }
}