# Auther: ZhengZhong,Jiang
# -*- coding:utf-8 -*-

import threading


def f1(args):
    print(args)

# obj = threading.Thread(target=f1, args=(123, ))
# obj.start()


class Mythread(threading.Thread):
    def __init__(self, func, args):
        self.func = func
        self.args = args

