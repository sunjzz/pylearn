# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/4/27 0027 下午 15:03

from xml.etree.ElementTree import Element, ElementTree, tostring

e = Element('Data')

e.set('name', 'abc')

tostring(e)

e.text = '123'

tostring(e)

print(tostring(e))

e2 = Element('Row')

e.append(e2)

e3 = Element('Open')

e3.text = '8.80'

e2.append(e3)

print(tostring(e))


et = ElementTree(e)

et.write('test.xml')
