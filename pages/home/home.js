// pages/home/home.js
var app = getApp();
Page({
    data: {
        usetInfo: {},
        // 弹框
        showModalStatus: false,
        // 个签
        signature: '这家伙很懒，什么也没留下',
        // 学习天数
        practiceday: '2',
        // 学习时间
        studytime: '13',
        // 完成联系节数
        practicetime: '3'
    },

    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.util(currentStatu)
    },
    util: function (currentStatu) {
        /* 动画部分 */
        // 第1步：创建动画实例   
        var animation = wx.createAnimation({
            duration: 200,  //动画时长  
            timingFunction: "linear", //线性  
            delay: 0  //0则不延迟  
        });

        // 第2步：这个动画实例赋给当前的动画实例  
        this.animation = animation;

        // 第3步：执行第一组动画  
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存  
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画  
        setTimeout(function () {
            // 执行第二组动画  
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
            this.setData({
                animationData: animation
            })

            //关闭  
            if (currentStatu == "close") {
                this.setData(
                    {
                        showModalStatus: false
                    }
                );
            }
        }.bind(this), 200)

        // 显示  
        if (currentStatu == "open") {
            this.setData(
                {
                    showModalStatus: true
                }
            );
        }
    },

    // 获取个签
    getSignatureVal: function (e) {
        console.log(e.detail.value);
        wx.setStorage({
            key: 'signature',
            value: 'e.detail.value'
        });
        this.setData({ signature: e.detail.value });
    },

    onLoad: function (options) {
        var that = this,
            userInfo = app.globalData.userInfo;
        that.setData({ //转换完毕存储
            userInfo: userInfo,
        })
        console.log(userInfo);
        wx.getSystemInfo({
            success: function (res) {
                var windowWidth = res.windowWidth * 0.5;
                that.setData({
                    //圆点坐标,x为屏幕一半,y为半径与margin-top之和,px
                    //后面获取的触摸坐标是px,所以这里直接用px.
                    dotPoint: {
                        clientX: windowWidth,
                        clientY: 250
                    }
                })
            }
        })

        // 获取个签
        wx.getStorage({
            key: 'signature',
            success(res) {
                console.log(res);
                that.setData({ signature: res.data });
            }
        });
    },

    onReady: function () {
    },
    // 跳转页面
    openPage: function (a) {
        var e = a.currentTarget.dataset.url;
        console.log(e);
        if (e === '/pages/about/about') {
            wx.navigateTo({
                url: e
            });
        }
    },
    chooseGeren: function () {
        wx.navigateTo({
            url: '../form/form',
        })
    },
    changeView: function () {
        wx.openSetting({})
    },

    onPullDownRefresh() {

    },
	/**
	 * 用户点击右上角分享
	 */
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '看看',
            path: 'pages/study/study',
            success: function (res) {
                // 转发成功
                wx.showShareMenu({
                    // 要求小程序返回分享目标信息
                    withShareTicket: true
                });
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})