var util = require('../../../utils/utils.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var movieId = options.id
        var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId
        util.http(url, this.processDoubanData)
    },

    processDoubanData(data) {
        console.log(data)
    }

    
})