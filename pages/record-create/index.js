const { requireRole } = require('../../utils/auth');

Page({
  data: {
    typeOptions: ['参加会议', '组会发言', '论文阅读', '其他'],
    type: '参加会议',
    title: '',
    date: '',
    content: '',
    summary: '',
    images: []
  },

  onShow() {
    requireRole(this, ['student']);
  },

  onTypeChange(e) {
    this.setData({ type: this.data.typeOptions[Number(e.detail.value)] });
  },
  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },
  onDateInput(e) {
    this.setData({ date: e.detail.value });
  },
  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },
  onSummaryInput(e) {
    this.setData({ summary: e.detail.value });
  },

  chooseImages() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      success: (res) => {
        const files = res.tempFiles.map(item => item.tempFilePath);
        this.setData({ images: files });
      }
    });
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.images
    });
  },

  getMonth(dateStr) {
    if (!dateStr || dateStr.length < 7) return '';
    return dateStr.slice(0, 7);
  },

  async uploadImages() {
    if (!this.data.images.length) return [];
    const tasks = this.data.images.map((filePath, index) => {
      const cloudPath = `records/${Date.now()}_${index}.png`;
      return wx.cloud.uploadFile({ filePath, cloudPath });
    });
    const results = await Promise.all(tasks);
    return results.map(item => item.fileID);
  },

  async submitRecord() {
    const { type, title, date, content, summary } = this.data;
    if (!type || !title || !date) {
      wx.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中' });
    try {
      const images = await this.uploadImages();
      await wx.cloud.callFunction({
        name: 'addRecord',
        data: {
          type,
          date,
          month: this.getMonth(date),
          title,
          content,
          summary,
          images
        }
      });
      wx.hideLoading();
      wx.showToast({ title: '提交成功' });
      setTimeout(() => wx.navigateBack(), 800);
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '提交失败', icon: 'none' });
      console.error(e);
    }
  }
});