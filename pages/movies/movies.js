var util = require('../../utils/utils.js')
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        textValue: '',
        searchResult: {},
        containerShow: true,
        searchPanelShow: false
    },
    onLoad: function(options) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=5&count=3"
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3"
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3"

        this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映')
        this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映')
        this.getMovieListData(top250Url, 'top250', '豆瓣Top250')
    },
    getMovieListData(url, settedkey, categoryTitle) {
        var that = this
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-Type': 'json'
            },
            success(res) {
                that.processMovieData(res.data.subjects, settedkey, categoryTitle)
            }
        })
    },

    processMovieData(moviesDouban, settedkey, categoryTitle) {
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
        var readyData = {}
        readyData[settedkey] = {
            categoryTitle: categoryTitle,
            movies: movies
        }
        this.setData(readyData)
    },

    onMoreTap(event) {
        var category = event.currentTarget.dataset.category
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category
        })
    },

    onMovieTap(event) {
        var movieId = event.currentTarget.dataset.movieid
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + movieId
        })
    },

    onBindFocus(event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },

    onCannelImgTap(event) {
        console.log(event)
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            textValue : ''
            //searchResult: {}
        })
    },

    onBindConfirm(event) {
        var text = event.detail.value
        var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl, "searchResult", "");
    }
})