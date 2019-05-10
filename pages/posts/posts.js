var postData = require('../../data/posts-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/images/wx.png',
      '/images/vr.png',
      '/images/iqiyi.png'
    ],
    'indicator-dots': true,
    'autoplay': true,
    'interval': 2000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postList: postData.postList
    })
  },

  onPostTap (even) {
    var postId = even.currentTarget.dataset.postId;
    wx.navigateTo({
      url: 'posts-detail/posts-detail?id=' + postId,
    })
  }


})