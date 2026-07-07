const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { mode, month } = event;

  let query = {};

  if (mode === 'mine') {
    query.studentId = openid;
  } else if (mode === 'mentor') {
    query.mentorId = openid;
  } else {
    return { data: [] };
  }

  if (month) {
    query.month = month;
  }

  const res = await db.collection('records')
    .where(query)
    .orderBy('createdAt', 'desc')
    .get();

  return {
    data: res.data || []
  };
};