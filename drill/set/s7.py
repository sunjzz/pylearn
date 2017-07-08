# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/7/3 0003 上午 8:43
import requests
import json


class Zabbix():
    def __init__(self):
        self.url = "http://zabbix.cmbc.com.cn/api_jsonrpc.php"
        self.header = {"Content-Type":"application/json"}

    def login(self):
        data = json.dumps(
        {
           "jsonrpc": "2.0",
           "method": "user.login",
           "params": {
           "user": "Admin",
           "password": "ldb1978yyt"
        },
        "id": 1
        })

        try:
            response = requests.post(self.url, data=data, headers=self.header)
        except requests.RequestException as e:
            result = e
        else:
            result = json.loads(response.text)['result']
        return result

    def get_host_list(self):
        data = json.dumps(
            {
                "jsonrpc": "2.0",
                "method": "host.get",
                "params": {
                    # "output": "extend",
                    # "filter": {"host": ["Zabbix server", ]}
                    "output": ["hostid", "name", "available"],
                    "filter": {"host": ""}
                },
                "auth": self.login(),
                "id": 1
            }
        )
        try:
            response = requests.post(self.url, data=data, headers=self.header)
        except requests.RequestException as e:
            print(e)
        else:
            result = json.loads(response.text)['result']
            # print(result)
            for index, item in enumerate(result):
                print(index, item['hostid'], item['available'], item['name'])


    def get_host_items(self):
        data = json.dumps(
            {
                "jsonrpc": "2.0",
                "method": "item.get",
                "params": {
                    "output": "extend",
                    "hostids": "10129",
                    "search": {
                        "key_": ""
                    },
                    "sortfield": "name"
                },
                "auth": self.login(),
                "id": 1
            }
        )
        try:
            response = requests.post(self.url, data=data, headers=self.header)
        except requests.RequestException as e:
            print(e)
        else:
            result = json.loads(response.text)['result']
            print(result)
            for index, item in enumerate(result):
                print(index, item)

a = Zabbix()
# a.get_host_list()
a.get_host_items()