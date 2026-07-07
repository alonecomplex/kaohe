const { requireRole } = require('../../utils/auth');

Page({
  data: {
    list: [],
    comments: {},
    month: ''
  },

  onShow() {
    if (requireRole(this, ['mentor'])) {
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
          mode: 'mentor',
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

  onCommentInput(e) {
    const id = e.currentTarget.dataset.id;
    const comments = this.data.comments;
    comments[id] = e.detail.value;
    this.setData({ comments });
  },

  async reviewRecord(e) {
    const recordId = e.currentTarget.dataset.id;
    const comment = this.data.comments[recordId] || '';

    wx.showLoading({ title: '提交中' });
    try {
      await wx.cloud.callFunction({
        name: 'reviewRecord',
        data: { recordId, comment }
      });
      wx.hideLoading();
      wx.showToast({ title: '审核成功' });
      this.fetchData();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '审核失败', icon: 'none' });
    }
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.current;
    const urls = e.currentTarget.dataset.urls;
    wx.previewImage({ current, urls });
  }
});