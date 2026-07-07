const app = getApp();

Page({
  data: {
    role: '',
    name: '',
    roleText: '未初始化'
  },

  onShow() {
    const role = app.globalData.role;
    const roleMap = {
      student: '研究生',
      mentor: '导师',
      assistant: '科研助理'
    };

    this.setData({
      role,
      name: app.globalData.name,
      roleText: roleMap[role] || '未初始化'
    });
  },

  goUserInit() {
    wx.navigateTo({ url: '/pages/user-init/index' });
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/record-create/index' });
  },

  goList() {
    wx.navigateTo({ url: '/pages/record-list/index' });
  },

  goMentor() {
    wx.navigateTo({ url: '/pages/mentor-review/index' });
  },

  goAdmin() {
    wx.navigateTo({ url: '/pages/admin-dashboard/index' });
  }
});