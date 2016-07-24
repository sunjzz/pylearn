#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Auther: ZhengZhong,Jiang

list = [11, 22, 33, 44, 55]

n = 0
def f(n):
    n += 1
    yield list[n]

for i in f:
    print(i)
