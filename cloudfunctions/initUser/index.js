const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { name, role, studentNo, major, grade, mentorId } = event;
  const now = Date.now();

  const existed = await db.collection('users').where({ openid }).get();

  const userData = {
    openid,
    name,
    role,
    studentNo: studentNo || '',
    major: major || '',
    grade: grade || '',
    mentorId: mentorId || '',
    updatedAt: now
  };

  if (existed.data.length) {
    const id = existed.data[0]._id;
    await db.collection('users').doc(id).update({
      data: userData
    });
    return {
      user: {
        ...existed.data[0],
        ...userData
      }
    };
  }

  await db.collection('users').add({
    data: {
      ...userData,
      createdAt: now
    }
  });

  return {
    user: {
      ...userData,
      createdAt: now
    }
  };
};