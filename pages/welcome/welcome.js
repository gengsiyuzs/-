// pages/welcome/welcome.js
var app = getApp();
var amapFile = require('../../libs/amap-wx.js');
var markersData = {
	latitude: '',//纬度
	longitude: '',//经度
	key: "8d0ad1e9ef4f14e9c39feaf5643b8660"
};
import util from "../../utils/util";
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: "",
		hasUserInfo: "",
		animation: {},
		deg: 1,
		weather: {
			temp: '还没有获取到喔~',
			weather: '你觉得今天天气怎么样呢 ☻',
			wind: '可能有风喔'
		},
		currentCity: "",
		currentLocation: "",
		hasTommorrowWeather: false
	},

	// 高德获取位置
	loadCity: function (latitude, longitude) {
		var that = this;
		var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
		myAmapFun.getRegeo({
			location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
			success: function (data) {
				wx.request({
					// url: "https://api.help.bj.cn/apis/weather/?id=101060101",
					url: "https://api.help.bj.cn/apis/weather2d/?id=" + data[0].regeocodeData.addressComponent.district,
					success: res => {
						that.setData({
							weather: res.data,
							hasTommorrowWeather: true
						});
						if (!res.data.weather) {
							that.setData({
								weather: {
									temp: '还没有获取到喔~',
									weather: '你觉得今天天气怎么样呢 ☻',
									wind: '可能有风喔'
								},
								hasTommorrowWeather: false
							});
							getApp().globalData.weather = {
								temp: '还没有获取到喔~',
								weather: '你觉得今天天气怎么样呢 ☻',
								wind: '可能有风喔'
							};
						}
					}
				});
				that.setData({
					currentCity: data[0].regeocodeData.addressComponent.province,
					currentLocation: data[0].name
				});
			},
			fail: function (res) {
				//失败回调
				wx.showModal({
					title: '错误',
					content: JSON.stringify(res)
				})
			}
		});
	},


	// 展示明天天气
	getTommorrowWeather: function (e) {
		let that = this;
		let tomorrow = that.data.weather.tomorrow;
		wx.showModal({
			title: '明天天气来咯~',
			content: '明日天气' + tomorrow.weather + '\r\n' + tomorrow.wind + '\r\n气温' + tomorrow.temp,
			cancelText: '退下吧',
			cancelColor: '#B8860B',
			confirmText: '朕知道了',
			confirmColor: '#9BCD9B'
		});
	},
	gotoIndex: e => {
		wx.switchTab({
			url: '../home/home'
		})
	},

	getUserInfo: function (e) {
		// console.log(e)
		app.globalData.userInfo = e.detail.userInfo
		this.setData({
			userInfo: e.detail.userInfo,
			hasUserInfo: true
		})
	},

	// 旋转
	rotateAni: function (n) {
		let num = Math.random().toFixed(1);
		this.animation.rotate(60 * (n) * num).step();
		this.setData({
			animation: this.animation.export(),
			deg: this.data.deg * (-1)
		})
	},

	// 获取位置
	getLocation: function () {
		let that = this;
		wx.getLocation({
			success: res => {
				var longitude = res.longitude
				var latitude = res.latitude
				that.loadCity(latitude, longitude);

				// console.log('测试公共请求');
				// let str = util.getData({
				// 	url: 'https://api.help.bj.cn/apis/weather2d/?id=%E6%B5%B7%E6%B7%80%E5%8C%BA'
				// }).then(data=>{
				// 	console.log('qqq', data);
				// });
				
				return;
				wx.request({
					url: "http://api.map.baidu.com/reverse_geocoding/v3/?ak=A9LFnAP0il5bchv1MYdGLj5clF2qNzIc&output=json&coordtype=wgs84ll&location=" + latitude + ',' + longitude,
					data: {},
					header: {
						'Content-Type': 'application/json'
					},
					success: function (res) {
						wx.showModal({
							cancelColor: 'cancelColor',
							title: '错误',
							content: JSON.stringify(res)
						})
						// success  
						var city = res.data.result.addressComponent.city;
						getApp().globalData.currentCity = city;
						getApp().globalData.currentLocation = res.data.result.addressComponent.district;
						that.setData({
							currentCity: city,
							currentLocation: res.data.result.addressComponent.district
						});
						// 天气
						wx.request({
							// url: "https://api.help.bj.cn/apis/weather/?id=101060101",
							url: "https://api.help.bj.cn/apis/weather2d/?id=" + that.data.currentLocation,
							success: res => {
								that.setData({
									weather: res.data,
									hasTommorrowWeather: true
								});
								if (!res.data.weather) {
									that.setData({
										weather: {
											temp: '还没有获取到喔~',
											weather: '你觉得今天天气怎么样呢 ☻',
											wind: '可能有风喔'
										},
										hasTommorrowWeather: false
									});
									getApp().globalData.weather = {
										temp: '还没有获取到喔~',
										weather: '你觉得今天天气怎么样呢 ☻',
										wind: '可能有风喔'
									};
								}
							}
						});
					},
					fail: function (err) {
						wx.showModal({
							cancelColor: 'cancelColor',
							title: '错误',
							content: JSON.stringify(err)
						})
						alert(JSON.stringify(err))
						that.setData({
							currentCity: "获取定位失败",
							currentLocation: "获取定位失败"
						});
						getApp().globalData.currentCity = "获取定位失败";
						getApp().globalData.currentLocation = "获取定位失败";
					}

				})
			}
		});
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		let that = this;
		wx.getSetting({
			success: res => {
				// 位置
				if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
					wx.showModal({
						title: '请求授权当前位置',
						content: '需要获取您的地理位置，请确认授权',
						success: function (res) {
							if (res.cancel) {
								wx.showToast({
									title: '拒绝授权',
									icon: 'none',
									duration: 1000
								})
							} else if (res.confirm) {
								wx.openSetting({
									success: function (dataAu) {
										if (dataAu.authSetting["scope.userLocation"] == true) {
											wx.showToast({
												title: '授权成功',
												icon: 'success',
												duration: 1000
											})
											//再次授权，调用wx.getLocation的API
											that.getLocation();
										} else {
											wx.showToast({
												title: '授权失败',
												icon: 'none',
												duration: 1000
											})
										}
									}
								})
							}
						}
					})
				} else if (res.authSetting['scope.userLocation'] == undefined) {
					//调用wx.getLocation的API
					that.getLocation();
				}
				else {
					//调用wx.getLocation的API
					that.getLocation();
				}

			}
		})


		if (app.globalData.userInfo) {
			this.setData({
				userInfo: app.globalData.userInfo,
				hasUserInfo: true
			})
		} else {
			// 在没有 open-type=getUserInfo 版本的兼容处理
			wx.getUserInfo({
				success: res => {
					app.globalData.userInfo = res.userInfo;
					this.setData({
						userInfo: res.userInfo,
						hasUserInfo: true
					})
				}
			})
		}
		// console.log(111, app.globalData);
		// 创建动画
		this.timer = setInterval(() => {
			this.rotateAni(this.data.deg);
		}, 2400);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.animation = wx.createAnimation({
			duration: 2400,
			timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
			delay: 0,
			transformOrigin: '50% 50% 0'
		});
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		clearInterval(this.timer);
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})