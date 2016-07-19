# Auther: ZhengZhong,Jiang
# -*- coding:utf-8 -*-

import threading
import queue
import time

q = queue.Queue(5)


def f1(args):
    q.put(str(args) + '- 包子')
    time.sleep(2)

for i in range(30):
    c = threading.Thread(target=f1, args=(i, ))
    c.start()


def f2(args):
    while True:
        print(args, q.get(args))

count = 0
while True:
    count += 1
    s = threading.Thread(target=f2, args=(count, ))
    s.start()

