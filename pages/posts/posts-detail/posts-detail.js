var postData = require('../../../data/posts-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    var postsData = postData.postList[postId];

    // 异步
    this.setData({
      postsData
    })
    // 同步
    //this.data.postsData = postsData

    // 同步设置缓存
    // wx.setStorageSync('key', {
    //   'name': '深圳',
    //   'address': '大学城'
    // })   
    //wx.removeStorageSync('key');   // 清除缓存
    //wx.clearStorageSync();       // 清除全部缓存
  },

  // onConnectionTap () {
  //   var test = wx.getStorageSync('key');   // 获取缓存
  //   console.log(test)
  // }

  

 
})