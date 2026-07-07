const app = getApp();

Page({
  data: {
    roleOptions: ['研究生', '导师', '科研助理'],
    roleValues: ['student', 'mentor', 'assistant'],
    roleLabel: '请选择角色',
    role: '',
    name: '',
    studentNo: '',
    major: '',
    grade: '',
    mentorId: ''
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },
  onStudentNoInput(e) {
    this.setData({ studentNo: e.detail.value });
  },
  onMajorInput(e) {
    this.setData({ major: e.detail.value });
  },
  onGradeInput(e) {
    this.setData({ grade: e.detail.value });
  },
  onMentorInput(e) {
    this.setData({ mentorId: e.detail.value });
  },
  onRoleChange(e) {
    const index = Number(e.detail.value);
    this.setData({
      roleLabel: this.data.roleOptions[index],
      role: this.data.roleValues[index]
    });
  },

  async submit() {
    const {name, role} = this.data;
    if (!name || !role) {
      wx.showToast({ title: '请填写姓名和角色', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '保存中' });
    try {
      const res = await wx.cloud.callFunction({
        name: 'initUser',
        data: {
          name,
          role,
          studentNo,
          major,
          grade,
          mentorId
        }
      });

      app.globalData.userInfo = res.result.user;
      app.globalData.role = res.result.user.role;
      app.globalData.name = res.result.user.name;

      wx.hideLoading();
      wx.showToast({ title: '保存成功' });
      setTimeout(() => wx.navigateBack(), 800);
    } catch (e) {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'none' });
      console.error(e);
    }
  }
});