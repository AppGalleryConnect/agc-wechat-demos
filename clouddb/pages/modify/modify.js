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
import {BookInfo} from '../model/BookInfo';

Page({
  data: {
    id: "",
    bookName: "",
    author: "",
    price: "",
    publisher: "",
    publishTime: ""
  },
  onLoad(options) {
    if (!options.value) {
      return;
    }
    const value = JSON.parse(options.value);
    this.setData({
      "id": value.id,
      "bookName": value.bookName,
      "author": value.author,
      "price": value.price,
      "publisher": value.publisher,
      "publishTime": value.publishTime,
    });
  },

  setBookName(e) {
    this.setData({
      'bookName': e.detail.value
    })
  },

  setAuthor(e) {
    this.setData({
      'author': e.detail.value
    })
  },

  setPrice(e) {
    this.setData({
      'price': e.detail.value
    })
  },

  setPublisher(e) {
    this.setData({
      'publisher': e.detail.value
    })
  },

  setPublishTime(e) {
    this.setData({
      'publishTime': e.detail.value
    })
  },

  async submit() {
    const bookInfo = new BookInfo();
    bookInfo.setId(parseInt(this.data.id));
    bookInfo.setBookName(this.data.bookName);
    bookInfo.setAuthor(this.data.author);
    if (this.data.price) {
      if (!common.isValidPrice(this.data.price)) {
        wx.showToast({
          title: 'price invalid',
          icon: 'error',
          duration: 1000
        });
        return;
      }
      bookInfo.setPrice(parseFloat(this.data.price));
    }
    bookInfo.setPublisher(this.data.publisher);
    if (this.data.publishTime) {
      if (!common.isValidDate(this.data.publishTime) || new Date(this.data.publishTime).getTime() < 0) {
        wx.showToast({
          title: 'time invalid',
          icon: 'error',
          duration: 1000
        });
        return;
      }
      bookInfo.setPublishTime(new Date(this.data.publishTime));
    }
    bookInfo.setShadowFlag(true);
    try {
      await common.upsertObject(bookInfo);
      wx.showToast({
        title: 'modify success',
        icon: 'success',
        duration: 1000,
        success: () => {
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
      });
    } catch (e) {
      console.error(e);
      wx.showToast({
          title: 'modify error',
          icon: 'error',
          duration: 1000
      });
    }
  }
})
