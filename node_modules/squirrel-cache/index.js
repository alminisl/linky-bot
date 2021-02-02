const fs = require("fs");
var CronJob = require("cron").CronJob;

const pathDefault = './data.json'

const storeData = (data, path) => {
  if(!path) {
    path = pathDefault
  }
  const dataToSaveInJson = {
    timestamp: new Date().getTime(),
    data,
  }
  try {
    fs.writeFileSync(path, JSON.stringify(dataToSaveInJson));
  } catch (err) {
    console.error(err)
  }
}

const loadFromCache = async (path) => {
  if(!path) {
    path = pathDefault
  }
  if(fs.existsSync(path)) {
    const returnData = JSON.parse(fs.readFileSync(path, "utf8"))
    return returnData
  } else {
    fs.appendFile(path, "", function (err) {
      if (err) throw err
    })
  }
}

module.exports = {
  loadFromCache,
  storeData
}

