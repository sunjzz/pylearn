#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li
import socket
class FtpClient(object):
    def __init__(self,ip,port):
        self.ip=ip
        self.port=port
        self.s=socket.socket()
        self.s.connect((self.ip,self.port))

        self.i