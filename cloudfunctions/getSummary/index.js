const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { month } = event;
  const query = {};

  if (month) {
    query.month = month;
  }

  const res = await db.collection('records').where(query).get();
  const list = res.data || [];

  const overview = {
    month: month || '全部',
    totalRecords: list.length,
    studentCount: 0,
    reviewedCount: 0,
    pendingCount: 0
  };

  const typeSummary = {
    meeting: 0,
    groupMeeting: 0,
    paperReading: 0,
    other: 0
  };

  const studentMap = {};
  const studentSet = new Set();

  list.forEach(item => {
    studentSet.add(item.studentId);

    if (item.status === 'reviewed') overview.reviewedCount += 1;
    else overview.pendingCount += 1;

    if (!studentMap[item.studentId]) {
      studentMap[item.studentId] = {
        studentId: item.studentId,
        studentName: item.studentName,
        studentNo: item.studentNo,
        meeting: 0,
        groupMeeting: 0,
        paperReading: 0,
        other: 0,
        reviewed: 0,
        pending: 0,
        total: 0
      };
    }

    if (item.type === '参加会议') {
      typeSummary.meeting += 1;
      studentMap[item.studentId].meeting += 1;
    } else if (item.type === '组会发言') {
      typeSummary.groupMeeting += 1;
      studentMap[item.studentId].groupMeeting += 1;
    } else if (item.type === '论文阅读') {
      typeSummary.paperReading += 1;
      studentMap[item.studentId].paperReading += 1;
    } else {
      typeSummary.other += 1;
      studentMap[item.studentId].other += 1;
    }

    if (item.status === 'reviewed') {
      studentMap[item.studentId].reviewed += 1;
    } else {
      studentMap[item.studentId].pending += 1;
    }

    studentMap[item.studentId].total += 1;
  });

  overview.studentCount = studentSet.size;

  const studentSummary = Object.values(studentMap).sort((a, b) => b.total - a.total);

  return {
    overview,
    typeSummary,
    studentSummary,

    chartData: {
      studentBar: {
        categories: studentSummary.map(item => item.studentName),
        series: [
          {
            name: '总数',
            data: studentSummary.map(item => item.total)
          },
          {
            name: '论文阅读',
            data: studentSummary.map(item => item.paperReading)
          },
          {
            name: '参加会议',
            data: studentSummary.map(item => item.meeting)
          },
          {
            name: '组会发言',
            data: studentSummary.map(item => item.groupMeeting)
          }
        ]
      },
      typePie: [
        { name: '参加会议', value: typeSummary.meeting },
        { name: '组会发言', value: typeSummary.groupMeeting },
        { name: '论文阅读', value: typeSummary.paperReading },
        { name: '其他', value: typeSummary.other }
      ]
    }
  };
};