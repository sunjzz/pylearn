#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Auther: ZhengZhong,Jiang

import libclass

msg = """
1.获取主机数据
2.设置主机数据
3.远程控制主机
"""

print(msg)

obj = libclass.Manager()

while True:
    choose = input(">>> ").strip()
    if choose == '1':
        for table_name in enumerate(libclass.result, start=1):
            print('%s.%s' % (table_name[0], table_name[1][0]))
        choose = input(">>> ").strip()
        obj.select(libclass.result[int(choose)-1][0])