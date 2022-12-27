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
import { CloudDBZoneQuery } from '@hw-agconnect/database';

Page({
  data: {
    bookName: "",
    author: "",
    minPrice: "",
    maxPrice: "",
    publisher: "",
    publishTime: ""
  },
  onLoad() {
    const queryData = common.getQueryData();
    this.setData({
      "bookName": queryData.bookName,
      "author": queryData.author,
      "minPrice": queryData.minPrice,
      "maxPrice": queryData.maxPrice,
      "publisher": queryData.publisher,
      "publishTime": queryData.publishTime
    })
  },
  setBookName(e) {
    this.setData({
      "bookName": e.detail.value
    });
  },
  setAuthor(e) {
    this.setData({
      'author': e.detail.value
    })
  },
  setPublisher(e) {
    this.setData({
      'publisher': e.detail.value
    })
  },
  setMinPrice(e) {
    this.setData({
      'minPrice': e.detail.value
    })
  },
  setMaxPrice(e) {
    this.setData({
      'maxPrice': e.detail.value
    })
  },
  setPublishTime(e) {
    this.setData({
      'publishTime': e.detail.value
    })
  },
  query() {
    const cloudDBQuery = CloudDBZoneQuery.where(BookInfo).equalTo("shadowFlag", true);
    if (this.data.bookName) {
      cloudDBQuery.equalTo("bookName", this.data.bookName);
    }
    if (this.data.author) {
      cloudDBQuery.equalTo("author", this.data.author);
    }
    if (this.data.publisher) {
      cloudDBQuery.equalTo("publisher", this.data.publisher);
    }

    if (this.data.minPrice && !this.data.maxPrice) {
      cloudDBQuery.greaterThanOrEqualTo("price", parseFloat(this.data.minPrice));
    }

    if (this.data.maxPrice && !this.data.minPrice) {
      cloudDBQuery.lessThanOrEqualTo("price", parseFloat(this.data.maxPrice));
    }

    if (this.data.maxPrice && this.data.minPrice) {
      const minPrice = parseFloat(this.data.minPrice);
      const maxPrice = parseFloat(this.data.maxPrice);
      if (minPrice > maxPrice) {
        wx.showToast({
          title: 'price error',
          icon: 'error',
          duration: 1000
        })
        return;
      }
      cloudDBQuery.lessThanOrEqualTo("price", maxPrice);
      cloudDBQuery.greaterThanOrEqualTo("price",minPrice);
    }

    if (this.data.publishTime) {
      if (!common.isValidDate(this.data.publishTime) || new Date(this.data.publishTime).getTime() < 0) {
          wx.showToast({
            title: 'time error',
            icon: 'error',
            duration: 1000
          })
          return;
      }
      cloudDBQuery.equalTo("publishTime", new Date(this.data.publishTime));
    }
    common.setCondition(cloudDBQuery);
    common.setQueryData(this.data.bookName, this.data.author,
      this.data.publisher, this.data.publishTime, 
      this.data.minPrice, this.data.maxPrice);
    wx.navigateBack({
      delta: 1,
      success: function(e){
        const page = getCurrentPages().pop();
        if (!page) {
          return;
        }
        page.onLoad();
      }
    });
  },
  clearQuery() {
    common.clearAllCondition();
    common.clearQueryData();
    wx.navigateBack({
      delta: 1,
      success: function(e){
        const page = getCurrentPages().pop();
        if (!page) {
          return;
        }
        page.onLoad();
      }
    });
  }
})
