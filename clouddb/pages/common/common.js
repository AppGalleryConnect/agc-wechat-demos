
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

import { default as schema } from '../config/app-schema';
import { default as context } from '../config/agconnect-services';
import { BookInfo } from '../model/BookInfo';
import { AGConnectCloudDB, CloudDBZoneQuery, CloudDBZoneConfig } from '@hw-agconnect/database';
import agconnect from '@hw-agconnect/api';
let cloudDB;
let zone;
let isOpenCloudDB = false;
let isOpenZone = false;
let queryCondition;
const reg = /^(((((0[48]|[2468][048]|[3579][26])00))|(([0-9]{2})(0[48]|[2468][048]|[13579][26])))[-|.|/| ]0?2[-|.|/| ]29|(((?!0{1,4})[0-9]{1,4})[-|.|/| ](((0[13-9]|1[0-2]|[13-9])[-|.|/| ](29|30))|((0[13578]|(10|12)|[13578])[-|.|/| ]31)|((0(?:[1-9])|1(?:[0-2])|[1-9])[-|.|/| ](0(?:[1-9])|1[0-9]|2[0-8]|[1-9])))))$/;
const priceReg = /^\d+(\.\d{0,2})?$/;
const numReg = /^-?\d+$/;

let queryData = {
    "bookName": "",
    "author": "",
    "minPrice": "",
    "maxPrice": "",
    "publisher": "",
    "publishTime": ""
}

export default {
    setCondition(conditions) {
        queryCondition = conditions;
    },
    getZoneStatus() {
        return isOpenZone;
    },
    getCondition() {
        return queryCondition.getQueryConditions();
    },
    initConfig() {
        if (!isOpenCloudDB) {
            agconnect.instance().configInstance(context);
            AGConnectCloudDB.initialize(context);
            cloudDB = AGConnectCloudDB.getInstance();
            cloudDB.createObjectType(schema);
            isOpenCloudDB = true;
            console.log('init success');
        }
    },
    async login() {
        const user = await agconnect.auth().getCurrentUser();
        if (!user) {
            await agconnect.auth().signInAnonymously();
        }
        if (!isOpenZone) {
            const config = new CloudDBZoneConfig('QuickStartDemo');
            zone = await cloudDB.openCloudDBZone(config);
            isOpenZone = true;
        }
    },
    async logout() {
        try {
            await agconnect.auth().signOut();
        } catch (error) {
            console.log('signOut failed', JSON.stringify(error));
        }
    },
    closeCloudDBZone() {
        try {
            this.agConnectCloudDB.closeCloudDBZone(zone);
            zone = null;
            isOpenZone = false;
        } catch (error) {
            console.log(error);
        }
    },
    async createSnapShot(callBack) {
        const query = CloudDBZoneQuery.where(BookInfo).equalTo('shadowFlag', true);
        if (!zone) {
            return;
        }
        await zone.subscribeSnapshot(query, callBack);
    },
    async query() {
        try {
            if (!zone) {
                wx.showToast({
                    title: 'openZone first',
                    icon: 'error',
                    duration: 1000
                });
                return;
            }
            let conditions = this.constructCondition();
            if (queryCondition) {
                conditions = queryCondition;
            }
            const data = await zone.executeQuery(conditions);
            return data.snapshotObjects;
        } catch (error) {
            console.error(error);
            wx.showToast({
                title: 'query error',
                icon: 'error',
                duration: 1000
            });
        }
    },
    async upsertObject(book) {
        if (!zone) {
            wx.showToast({
                title: 'openZone first',
                icon: 'error',
                duration: 1000
            });
            return;
        }
        await zone.executeUpsert(book);
    },
    async deleteObject(book) {
        try {
            await zone.executeDelete(book);
        } catch (error) {
            console.error(error);
            wx.showToast({
                title: 'delete error',
                icon: 'error',
                duration: 1000
            });
        }
    },
    constructCondition() {
        try {
            return CloudDBZoneQuery.where(BookInfo).equalTo("shadowFlag", true);
        } catch (error) {
            console.error(error);
        }
    },
    isValidDate(date) {
        return reg.test(date);
    },
    isValidPrice(price) {
        return priceReg.test(price);
    },
    isValidNum(num) {
        return numReg.test(num);
    },
    parseDate(date) {
        const year = date.getFullYear();
        let month = (date.getMonth() + 1).toString();
        let day = (date.getDate()).toString();
        if (month.length === 1) {
            month = "0" + month;
        }
        if (day.length === 1) {
            day = "0" + day;
        }
        const dateTime = year + "-" + month + "-" + day;
        return dateTime;
    },
    handleTime(date) {
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    },
    clearAllCondition() {
        queryCondition = null;
    },
    async indexQuery() {
        try {
            if (!zone) {
                return;
            }
            let conditions = this.constructCondition();
            if (queryCondition) {
                conditions = queryCondition;
            }
            const data = await zone.executeQuery(conditions);
            return data.snapshotObjects;
        } catch (error) {
            console.log(error);
            wx.showToast({
                title: 'query error',
                icon: 'error',
                duration: 1000
            });
        }
    },
    setQueryData(bookName, author, publisher, publishTime, minPrice, maxPrice) {
        queryData.bookName = bookName;
        queryData.author = author;
        queryData.publisher = publisher;
        queryData.publishTime = publishTime;
        queryData.minPrice = minPrice;
        queryData.maxPrice = maxPrice;
    },
    getQueryData() {
        return queryData;
    },
    clearQueryData() {
        queryData = {
            "bookName": "",
            "author": "",
            "minPrice": "",
            "maxPrice": "",
            "publisher": "",
            "publishTime": ""
        }
    }
}
