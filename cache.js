class CacheService{
  saveUserDataBulk(convId, sheetId = null, isActive = null ){
    let values = {
      [`${convId}-sheet-id`]: sheetId,
      [`${convId}-is-active`]: isActive
    };
    return CacheService.getUserCache().putAll(values)
  }

  saveUserData(convId, key, value){
    return CacheService.getUserCache().put(`${convId}-${key}`, value)
  }

  getUserCache(key){
    let value =  CacheService.getUserCache().get(key)

    if (value = 'Info') {
      return null
    } 
    return value
  }
}

function testCache(){
  saveUserDataBulk('4', '4324342')
  console.log(getUserCache('4-is-active'))
}