#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li
import socket
ip_port=('127.0.0.1',9999)
s=socket.socket()
s.connect(ip_port)


while True:
    send_data=input(">>: ").strip()
    if len(send_data) == 0:continue
    s.send(bytes(send_data,'utf8'))

    recv_data=s.recv(1024)
    print(str(recv_data,'utf8'))

s.close()







