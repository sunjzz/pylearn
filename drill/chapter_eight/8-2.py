# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/4/26 0026 下午 16:17


from xml.etree.ElementTree import parse

f = open('demo.xml', 'r')

et = parse(f)

root = et.getroot()

print(root)

print(root.tag)

print(root.attrib)

print(root.text)

print(root.text.strip())

for child in root:
    print(child.get('category'))


print(root.find('book'))

print(root.findall('book'))

generator_obj = root.iterfind('book')

for i in generator_obj:
    print(i.get('category'))


# find(), findall(), iterfind() 只能找当前节点直接的子元素

# iter() 查找当前节点所有子元素

# findall(匹配模式)

# book/*

for x in root.findall('book/*'): # 匹配book下所有子元素
    print(x)

for x in root.findall('.//year'): # 无论year在哪个节点
    print(x)

# root.findall('.//year/..') # 后面的..描述父元素

# root.findall('title[@lang]') # title 包含lang属性的元素

# root.findall('title[@lang=en]') # title 包含lang属性等于en的元素
# root.findall('title[@lang=en]') # title 包含lang属性等于en的元素