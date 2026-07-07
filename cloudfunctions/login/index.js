const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;

  const userRes = await db.collection('users').where({ openid }).get();
  const user = userRes.data[0] || null;

  return {
    openid,
    user
  };
};