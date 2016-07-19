#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li
import socket
ip_port=('127.0.0.1',9999)
s=socket.socket()
s.bind(ip_port)
s.listen(5)

while True:
    conn,addr=s.accept()
    while True:
        try:
            recv_data=conn.recv(1024)
            print('RECV %s [%s]' %(addr,recv_data))

            send_data=recv_data.upper()
            conn.send(send_data)
        except Exception:
            break

    conn.close()



#1.客户端输入不为空 2.客户端断服务端断 3.粘包  4.单进程


