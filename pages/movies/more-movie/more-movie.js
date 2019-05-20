// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/utils.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        navigateTitle: '',
        requestUrl: '',
        totalCount: 0,
        isEmpty: true
    },

    /**
     * 加载页面标题
     */
    onReady() {
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var category = options.category
        this.data.navigateTitle = category
        var dataUrl = ''
        switch (category) {
            case "正在热映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
                break;
        }
        this.data.requestUrl = dataUrl
        util.http(dataUrl, this.processMovieData)
        wx.showNavigationBarLoading()
    },

    processMovieData(moviesDouban) {
        var movies = []
        for (var index in moviesDouban) {
            var subject = moviesDouban[index]
            var title = subject.title
            if (title.length > 6) {
                title = title.substring(0, 6) + "..."
            }
            var temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id
            }
            movies.push(temp)          
        }
        var totalmovies = {}
        this.data.totalCount += 20
        if (!this.data.isEmpty) {
            totalmovies = this.data.movies.concat(movies)
        } else {
            totalmovies = movies
            this.data.isEmpty = false
        }
        this.setData({
            movies: totalmovies
        })
        wx.hideNavigationBarLoading()
    },

    /**
     * 下拉加载数据
     */
    onScrollLower(event) {
        var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20'
        util.http(nextUrl, this.processMovieData)
    }
})