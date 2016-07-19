#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li
import socket
ip_port=('127.0.0.1',9999)
#买手机
s=socket.socket()
s.bind(ip_port)
s.listen(0)
#等待电话
while True:
    conn,addr=s.accept()
    #收消息
    while True:
            try:
                recv_data=conn.recv(1024)
                if len(recv_data) == 0:break

                #发消息
                send_data=recv_data.upper()

                print(send_data)
                conn.send(send_data)
            except Exception:
                break
    #挂电话
    conn.close()

