#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li
import socket
ip_port=('127.0.0.1',9999)
#买手机
s=socket.socket()
#拨号
s.connect(ip_port)
#发送消息
while True:
    send_data=input(">>: ").strip()
    if send_data == 'exit':break
    if len(send_data) == 0:continue
    s.send(bytes(send_data,encoding='utf8'))

    #收消息
    recv_data=s.recv(1024)
    print(str(recv_data,encoding='utf8'))
    #挂电话
s.close()



