# Auther: ZhengZhong,Jiang
# -*- coding:utf-8 -*-

import threading
import queue
import time

q = queue.Queue(20)


def f1(args):
    while True:
        print(q.put(args), q.get(args), '包子')
        time.sleep(2)

for i in range(30):
    c = threading.Thread(target=f1, args=(i, ))
    c.start()


def f2(args):
    while True:
        q.get(args)

count = 0
while True:
    count += 1
    s = threading.Thread(target=f2, args=(count, ))
    s.start()

