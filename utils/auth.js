const app = getApp();

function requireRole(page, roles = []) {
  const role = app.globalData.role;
  if (!role) {
    wx.navigateTo({ url: '/pages/user-init/index' });
    return false;
  }

  if (roles.length && !roles.includes(role)) {
    wx.showToast({ title: '无权限访问', icon: 'none' });
    setTimeout(() => {
      wx.navigateBack({ delta: 1 });
    }, 800);
    return false;
  }

  return true;
}

module.exports = {
  requireRole
};