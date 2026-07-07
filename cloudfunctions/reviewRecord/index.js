const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { recordId, comment } = event;
  const now = Date.now();

  const recordRes = await db.collection('records').doc(recordId).get();
  const record = recordRes.data;

  if (!record) {
    throw new Error('记录不存在');
  }

  if (record.mentorId !== openid) {
    throw new Error('无权限审核该记录');
  }

  return await db.collection('records').doc(recordId).update({
    data: {
      status: 'reviewed',
      mentorComment: comment || '',
      reviewedAt: now,
      updatedAt: now
    }
  });
};