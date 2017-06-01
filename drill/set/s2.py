# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/5/31 0031 下午 16:08

import re
from xml.etree import ElementTree as ET

with open('result', 'r') as f:
    str = f.read().decode('gb18030')
    print(str)
    xml_str_list = re.split('BytesMessage:|</REQUEST>', str)
    xml_list = []
    for index in range(len(xml_str_list)):
        if xml_str_list[index].startswith('<?xml'):
            xml_str_list[index]=xml_str_list[index].replace("GB18030","UTF-8")
            xml_str_list[index] += "</REQUEST>"
            print(xml_str_list[index])
            xml_list.append(xml_str_list[index].encode('utf8'))
    print(xml_list)

print# for item in xml_list:
#     root = ET.fromstring(item)
#     print(root)