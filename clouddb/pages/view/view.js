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
  }
})
