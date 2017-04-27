# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/4/27 0027 下午 15:35

import csv
from xml.etree.ElementTree import Element, ElementTree


def csvToxml(fname):
    with open(fname, 'rb') as f:
        reader = csv.reader(f)
        headers = reader.next()

    root = Element('Data')
    for row in reader:
        eRow = Element('Row')
        root.append(eRow)
        for tag, text in zip(headers, row): # 使用zip方法 同时迭代两个
            e = Element(tag)
            e.text = text
            eRow.append(e)

    return ElementTree(root)


def pretty(e, level=0):
    if len(e) > 0:
        e.text = '\n' + '\t' * (level + 1)
        for child in e:
            pretty(child, level + 1)
        child.tail = child.tail[:-1]
    e.tail = '\n' + '\t' * level


et = csvToxml('pingan.csv')
et.write('pingan.xml')
