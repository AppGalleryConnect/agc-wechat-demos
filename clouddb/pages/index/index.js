/*
* Copyright 2020. Huawei Technologies Co., Ltd. All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import common from '../common/common'; 
import { BookInfo } from '../model/BookInfo';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    listArr: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../insert/insert'
    })
  },
  query() {
    wx.navigateTo({
      url: '../query/query'
    })
  },
  onReady() {
    common.initConfig();
  },
  async onLoad() {
    const dataList = await common.indexQuery();
    if (!dataList) {
      return;
    }
    dataList.forEach(value => {
      if (value.publishTime) {
        value.publishTime = common.parseDate(value.publishTime);
      }
    })
    this.setData({
      'listArr': dataList
    })
  },
  async login() {
    try {
      await common.login();
      await common.createSnapShot({
        onSnapshot: async (snapshot, e) => {
            if (e) {
                console.error(JSON.stringify(e));
            } else {
              const dataList = await common.indexQuery();
              dataList.forEach(value => {
                if (value.publishTime) {
                  value.publishTime = common.parseDate(value.publishTime);
                }
              });
              this.setData({
                'listArr': dataList
              });
            }
        }});
        wx.showToast({
          title: 'signIn success',
          icon: 'success',
          duration: 1000
        });
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: 'signIn failed',
        icon: 'error',
        duration: 1000
      });
    }
  },
  view(e) {
    const bookInfo = e.currentTarget.dataset.value;
    wx.navigateTo({ 
      url: "../view/view?value=" + JSON.stringify(bookInfo)
    });
  },
  modify(e) {
    const bookInfo = e.currentTarget.dataset.value;
    wx.navigateTo({ 
      url: "../modify/modify?value=" + JSON.stringify(bookInfo)
    });
  },
  del(e) {
    const id = e.currentTarget.dataset.id;
    const bookInfo = new BookInfo();
    bookInfo.setId(parseInt(id));
    common.deleteObject(bookInfo);
  }
})
