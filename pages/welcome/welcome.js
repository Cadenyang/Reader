Page({
    onTap: function (event) {
        // wx.navigateTo({
        //     url:"../posts/post"
        // });
        
        wx.redirectTo({
            url: "../posts/posts"
        });
      
    },
    onReachBottom:function(event){
    }
})