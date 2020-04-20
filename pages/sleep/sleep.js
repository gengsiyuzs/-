// pages/sleep/sleep.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		page: 1,
		joke: [],
		jokeType: 'image', // 笑话类型
		currentIndex: 0, //当前tab页
	},

	//用户点击tab时调用
	titleClick: function (e) {
		if (this.data.currentIndex == e.currentTarget.dataset.idx) {
			console.log('点的一样玩什么');
			return;
		}

		let jokeType = 'image';
		console.log(e.currentTarget.dataset.idx)
		if (e.currentTarget.dataset.idx == 1) {
			jokeType = 'video';
		} else if (e.currentTarget.dataset.idx == 2) {
			jokeType = 'beauty';
		}
		this.setData({
			//拿到当前索引并动态改变
			currentIndex: e.currentTarget.dataset.idx,
			jokeType: jokeType,
			page: 1,
			joke: []
		});
		this.getJoke();
	},

	//预览图片
	lookImg: function (e) {
		let src = e.currentTarget.dataset.src;
		//图片预览
		wx.previewImage({
			urls: [src]
		})
	},

	// 请求数据
	getJoke: function () {
		wx.showLoading({
			title: '小主莫急~',
			make: true
		});
		let that = this;
		let url = 'https://api.apiopen.top/getJoke?page=' + that.data.page + '&type=' + this.data.jokeType;
		if (this.data.jokeType === 'beauty') {
			url = `https://gank.io/api/v2/data/category/Girl/type/Girl/page/${this.data.page}/count/1`;
		}
		wx.request({
			url: url,
			success: res => {
				let newData = that.data.joke;
				if (this.data.jokeType === 'beauty') {
					newData = newData.concat(res.data.data);
					newData.forEach(item => {
						item.text = item.desc;
						item.name = item.author;
						item.passtime = item.createdAt;
						item.images = item.url;
						item.header = item.url;
					});
				} else {
					newData = newData.concat(res.data.result);
				}
				if (res.data.result || res.data.data) {
					that.setData({ joke: newData });
				}
				wx.showLoading({
					title: '加载成功',
					make: true
				});
				setTimeout(() => {
					wx.hideLoading()
				}, 500);
			},
			fail: err => {
				wx.showLoading({
					title: '加载失败，请重新刷新',
					make: true
				});
				setTimeout(() => {
					wx.hideLoading()
				}, 1000);
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getJoke();
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

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		// console.log('下拉');
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		console.log('到底了');
		wx.showLoading({
			title: '加载更多',
			make: true
		});
		this.setData({
			page: this.data.page += 1
		});
		this.getJoke();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		
	}
})