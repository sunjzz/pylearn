#!/usr/bin/env python
# -*- coding:utf-8 -*-
# @Time     : 2017/3/16 0016 下午 15:33
# @Author   : ZhengZhong,Jiang

data = [5, 4, 7, 8, 2, 3, 1, 9]


def bubble_sort(data):
    for i in range(len(data) - 1):
        flag = True
        for j in range(len(data) - i - 1):
            if data[j] > data[j+1]:
                data[j], data[j+1] = data[j+1], data[j]
                flag = False
        if flag:
            return data
    return data


def choice_sort(data):
    for i in range(len(data) - 1):
        min_loc = i
        for j in range(i + 1, len(data)):
            if data[i] > data[j]:
                min_loc = j
    return data


def insert_sort(data):
    for i in range(len(data)):
        tmp = data[i]
        j = i - 1
        while j >= 0 and data[j] > tmp:
            data[j+1] = data[j]
            j -= 1
        data[i] = tmp
    return data


def quick_sort(data, left, right):
    if left < right:
        mid = partition(data, left, right)
        quick_sort(data, left, mid - 1)
        quick_sort(data, mid + 1, right)
    return data


def partition(data, left, right):
    tmp = data[left]
    while left < right:
        while left < right and data[right] >= tmp:
            right -= 1
        data[left] = data[right]
        while left < right and data[left] <= tmp:
            left += 1
        data[right] = data[left]
    data[left] = tmp
    return left

print(bubble_sort(data))
print(choice_sort(data))
print(insert_sort(data))
print(quick_sort(data, 0, 7))

