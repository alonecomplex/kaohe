const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const now = Date.now();

  const userRes = await db.collection('users').where({ openid }).get();
  const user = userRes.data[0];

  if (!user) {
    throw new Error('用户未初始化');
  }

  if (user.role !== 'student') {
    throw new Error('仅学生可提交记录');
  }

  const { type, date, month, title, content, summary, images } = event;

  return await db.collection('records').add({
    data: {
      studentId: openid,
      studentName: user.name,
      studentNo: user.studentNo,
      mentorId: user.mentorId,
      type,
      date,
      month,
      title,
      content: content || '',
      summary: summary || '',
      images: images || [],
      status: 'pending',
      mentorComment: '',
      reviewedAt: null,
      createdAt: now,
      updatedAt: now
    }
  });
};