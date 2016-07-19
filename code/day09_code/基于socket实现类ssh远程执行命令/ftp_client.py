#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Author:Alex Li

import socket
import os ,json
ip_port=('192.168.11.150',8009)
#买手机
s=socket.socket()
#拨号
s.connect(ip_port)
#发送消息
welcome_msg = s.recv(1024)
print("from server:",welcome_msg.decode())
while True:
    send_data=input(">>: ").strip()
    if len(send_data) == 0:continue

    cmd_list = send_data.split()
    if len(cmd_list) <2:continue
    task_type = cmd_list[0]
    if task_type == 'put':
        abs_filepath = cmd_list[1]
        if os.path.isfile(abs_filepath):
            file_size = os.stat(abs_filepath).st_size
            filename = abs_filepath.split("\\")[-1]
            print('file:%s size:%s' %(abs_filepath,file_size))
            msg_data = {"action":"put",
                        "filename":filename,
                        "file_size":file_size}

            s.send(  bytes(json.dumps(msg_data),encoding="utf-8")  )
            server_confirmation_msg = s.recv(1024)
            confirm_data = json.loads(server_confirmation_msg.decode())
            if confirm_data['status'] ==200:

                print("start sending file ",filename)
                f = open(abs_filepath,'rb')
                for line in f:
                    s.send(line)

                print("send file done ")

        else:
            print("\033[31;1mfile [%s] is not exist\033[0m" % abs_filepath)
            continue
    else:
        print("doesn't support task type",task_type)
        continue
    #s.send(bytes(send_data,encoding='utf8'))
    #收消息
    recv_data=s.recv(1024)
    print(str(recv_data,encoding='utf8'))
    #挂电话
s.close()
