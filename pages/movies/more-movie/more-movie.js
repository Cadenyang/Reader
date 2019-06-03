var app = getApp();
var util = require('../../../utils/utils.js')
Page({
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

    onMovieTap(event) {
        var movieId = event.currentTarget.dataset.movieid
        wx.navigateTo({
            url: '../movie-detail/movie-detail?id=' + movieId
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

    /**
     * 数据加载
     */
    processMovieData(moviesDouban) {
        var movies = []
        for (var index in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[index]
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
        // 下拉刷新加载数据
        var totalmovies = {}
        this.data.totalCount += 20
        // 初次加载数据
        if (!this.data.isEmpty) {
            totalmovies = this.data.movies.concat(movies)  // 复制数据到新的数组
        } else {
            totalmovies = movies
            this.data.isEmpty = false
        }
        this.setData({
            movies: totalmovies
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
    },

    /**
     * 下拉加载数据
     */
    // onScrollLower(event) {
    //     var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20'
    //     util.http(nextUrl, this.processMovieData)
    // },
    onReachBottom(event) {
        var nextUrl = this.data.requestUrl + '?start=' + this.data.totalCount + '&count=20'
        util.http(nextUrl, this.processMovieData)
    },

    /**
     * 下拉刷新 (不会执行，是因为使用了scroll-view)
     */
    onPullDownRefresh(event) {
        var refershUrl = this.data.requestUrl + '?start=0&count=20'
        this.data.movies = {}
        this.data.isEmpty = true
        util.http(refershUrl, this.processMovieData)
        wx.startPullDownRefresh()
    }
})