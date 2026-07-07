App({
  globalData: {
    userInfo: null,
    role: '',
    openid: '',
    name: ''
  },

  async onLaunch() {
    if (!wx.cloud) {
      console.error('当前基础库不支持云开发');
      return;
    }

    wx.cloud.init({
      env: '你的云开发环境ID',
      traceUser: true
    });

    try {
      const res = await wx.cloud.callFunction({ name: 'login' });
      const { openid, user } = res.result;
      this.globalData.openid = openid;

      if (user) {
        this.globalData.userInfo = user;
        this.globalData.role = user.role;
        this.globalData.name = user.name;
      }
    } catch (e) {
      console.error('登录失败', e);
    }
  }
})