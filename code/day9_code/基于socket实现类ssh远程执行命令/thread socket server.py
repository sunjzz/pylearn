#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li


#!/usr/bin/env python
# -*- coding:utf-8 -*-
#import SocketServer
import socketserver

class MyServer(socketserver.BaseRequestHandler):
    def handle(self):
        # print self.request,self.client_address,self.server
        self.request.sendall(bytes('欢迎致电 10086，请输入1xxx,0转人工服务.',encoding="utf-8"))
        while True:
            data = self.request.recv(1024)
            print("-->",len(data))
            if len(data) == 0:break
            print("[%s] says:%s" % (self.client_address,data.decode() ))
            self.request.sendall(data.upper())

if __name__ == '__main__':
    server = socketserver.ThreadingTCPServer(('127.0.0.1',8009),MyServer)
    server.serve_forever()

