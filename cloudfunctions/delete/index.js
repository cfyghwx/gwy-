// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  let planid = event.planid
  try {
    return await db.collection('message').where({
      planid:planid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}