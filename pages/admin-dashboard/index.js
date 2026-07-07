const { requireRole } = require('../../utils/auth');

Page({
  data: {
    month: '',
    overview: null,
    typeSummary: null,
    studentSummary: []
  },

  onShow() {
    if (requireRole(this, ['assistant'])) {
      this.fetchSummary();
    }
  },

  onMonthInput(e) {
    this.setData({ month: e.detail.value });
  },

  async fetchSummary() {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await wx.cloud.callFunction({
        name: 'getSummary',
        data: {
          month: this.data.month
        }
      });

      const data = res.result || {};
      this.setData({
        overview: data.overview || null,
        typeSummary: data.typeSummary || null,
        studentSummary: data.studentSummary || []
      });
      wx.hideLoading();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  }
});