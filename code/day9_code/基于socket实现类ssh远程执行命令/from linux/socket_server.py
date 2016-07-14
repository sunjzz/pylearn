#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li


#!/usr/bin/env python
# -*- coding:utf-8 -*-
#import SocketServer
import socketserver
import subprocess 
class MyServer(socketserver.BaseRequestHandler):
    def handle(self):
        # print self.request,self.client_address,self.server
        self.request.sendall(bytes('欢迎致电 10086，请输入1xxx,0转人工服务.',encoding="utf-8"))
        while True:
            data = self.request.recv(1024)
            if len(data) == 0:break
            print("[%s] says:%s" % (self.client_address,data.decode() ))
            #self.request.sendall(data.upper())
            cmd = subprocess.Popen(data.decode(),shell=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
            cmd_res =cmd.stdout.read()
            if not cmd_res:
               cmd_res = cmd.stderr.read()
            if len(cmd_res) == 0: #cmd has not output 
               cmd_res = bytes("cmd has output",encoding="utf-8")
            self.request.send(cmd_res )


if __name__ == '__main__':
    server = socketserver.ThreadingTCPServer(('0.0.0.0',8009),MyServer)
    server.serve_forever()


