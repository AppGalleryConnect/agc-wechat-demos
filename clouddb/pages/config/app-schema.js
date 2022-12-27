/*
* Copyright 2022. Huawei Technologies Co., Ltd. All rights reserved.
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

export default {
    "schemaVersion": 1,
    "permissions": [
      {
        "permissions": [
          {
            "role": "World",
            "rights": [
              "Read"
            ]
          },
          {
            "role": "Authenticated",
            "rights": [
              "Read"
            ]
          },
          {
            "role": "Creator",
            "rights": [
              "Read",
              "Upsert",
              "Delete"
            ]
          },
          {
            "role": "Administrator",
            "rights": [
              "Read",
              "Upsert",
              "Delete"
            ]
          }
        ],
        "objectTypeName": "BookInfo"
      }
    ],
    "objectTypes": [
      {
        "indexes": [],
        "objectTypeName": "BookInfo",
        "fields": [
          {
            "isNeedEncrypt": false,
            "fieldName": "id",
            "notNull": true,
            "belongPrimaryKey": true,
            "fieldType": "Integer"
          },
          {
            "isNeedEncrypt": false,
            "fieldName": "bookName",
            "notNull": false,
            "belongPrimaryKey": false,
            "fieldType": "String"
          },
          {
            "isNeedEncrypt": false,
            "fieldName": "author",
            "notNull": false,
            "belongPrimaryKey": false,
            "fieldType": "String"
          },
          {
            "isNeedEncrypt": false,
            "fieldName": "price",
            "notNull": false,
            "belongPrimaryKey": false,
            "fieldType": "Double"
          },
          {
            "isNeedEncrypt": false,
            "fieldName": "publisher",
            "notNull": false,
            "belongPrimaryKey": false,
            "fieldType": "String"
          },
          {
            "isNeedEncrypt": false,
            "fieldName": "publishTime",
            "notNull": false,
            "belongPrimaryKey": false,
            "fieldType": "Date"
          },
          {
            "isNeedEncrypt": false,
            "fieldName": "shadowFlag",
            "notNull": true,
            "defaultValue": "true",
            "belongPrimaryKey": false,
            "fieldType": "Boolean"
          }
        ]
      }
    ]
  }
