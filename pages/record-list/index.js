const { requireRole } = require('../../utils/auth');

Page({
  data: {
    list: [],
    month: ''
  },

  onShow() {
    if (requireRole(this, ['student'])) {
      this.fetchData();
    }
  },

  onMonthInput(e) {
    this.setData({ month: e.detail.value });
  },

  async fetchData() {
    wx.showLoading({ title: '加载中' });
    try {
      const res = await wx.cloud.callFunction({
        name: 'getRecords',
        data: {
          mode: 'mine',
          month: this.data.month
        }
      });
      this.setData({ list: res.result.data || [] });
      wx.hideLoading();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.current;
    const urls = e.currentTarget.dataset.urls;
    wx.previewImage({ current, urls });
  }
});