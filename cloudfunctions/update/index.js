// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id
  let applyidList = event.applyidList
  let joinidList = event.joinidList
  try {
    return await db.collection('Cplan').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        applyidList: applyidList,
        joinidList:joinidList
      },
    })
  } catch (e) {
    console.error(e)
  }
}