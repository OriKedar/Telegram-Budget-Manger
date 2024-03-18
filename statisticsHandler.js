function getWeekllyUsage(user_id){
  const budget = getMonthlyBudget(user_id) / 4; 
  const totalWeekSpent = roundToTwo(sumRows(getRowsFromLastWeek(user_id)));

  if (budget - totalWeekSpent >= 0){
    return `Your weekly budget is ${budget} EUR \nThis week you already used: ${totalWeekSpent} EUR \nYou still have ${roundToTwo(budget - totalWeekSpent)} EUR to spent!`
  } else if (budget - totalWeekSpent < 0){
    return `Oh no... \nYour weekly budget is ${budget} EUR \nThis week you already used: ${totalWeekSpent} EUR \nYou exceeded by ${roundToTwo(totalWeekSpent - budget)} EUR`
  }
}

function getMonthlyUsage(user_id){
  const budget = getMonthlyBudget(user_id);
  const totalMonthSpent = roundToTwo(sumRows(getRowsFromLastMonth(user_id)));

  if (budget - totalMonthSpent >= 0){
    return `Your monthly budget is ${budget} EUR, you used ${totalMonthSpent} EUR \nYou still have ${roundToTwo(budget - totalMonthSpent)} EUR to Spent!`
  } else if (budget - totalMonthSpent < 0){
    return `Oh no... \nYour monthly budget is ${budget} EUR, you used ${totalMonthSpent} EUR \nYou exceeded by ${roundToTwo(totalMonthSpent - budget)} EUR`
  }
}