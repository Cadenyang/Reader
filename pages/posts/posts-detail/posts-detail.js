var postData = require('../../../data/posts-data.js')
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isMusic: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var postId = options.id;
        this.data.currentId = postId
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

        /* 收藏功能 */
        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {}
            postsCollected[postId] = false
            wx.setStorageSync('posts_collected', postsCollected)
        }

        // 播放器同步
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicId === postId){
            this.setData({
                isMusic : true 
            })
        }


        // 监听音乐播放
        var that = this
        wx.onBackgroundAudioPlay(function() {   
            that.setData({
                isMusic : true
            })
            app.globalData.g_isPlayingMusic = true
            app.globalData.g_currentMusicId = this.data.currentId
        });
        // 监听音乐暂停
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isMusic: false
            })
            app.globalData.g_isPlayingMusic = false
            app.globalData.g_currentMusicId = null
        });
    },
  
    // 收藏
    onCollectTap(event) {
        this.getPostsCollectedSync(); // 同步请求
        //this.getPostsCollectedAsy();  // 异步请求
    },

    //  异步请求
    getPostsCollectedAsy() {
        var that = this;
        wx.getStorage({
            key: "posts_collected",
            success(res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.currentId];
                // 收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },

    //  同步请求
    getPostsCollectedSync() {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },


    showModal(postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
            showCancel: "true",
            cancelText: "取消",
            cancelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success(res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    // 更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    showToast(postsCollected, postCollected) {
        // 更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        // 更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
    },

    // 分享
    onShareTap() {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#405f80',
            success(res) {
                wx.showModal({
                    title: itemList[res.tapIndex],
                    content: res.cancel + "现在无法实现分享功能。"
                })
            }
        })
    },

    // 详情页音乐播放
    onPlayMusic() {
        var musicList = postData.postList[this.data.currentId].music
        var isMusic = this.data.isMusic
        if (isMusic) {
            wx.stopBackgroundAudio()
            this.setData({
                isMusic: false
            })
        }else{
            wx.playBackgroundAudio({
                dataUrl: musicList.url,
                title: musicList.title,
                coverImgUrl: musicList.coverImg
            })
            this.setData({
                isMusic: true
            })
        }
    }
})