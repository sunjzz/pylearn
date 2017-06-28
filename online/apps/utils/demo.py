# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/12 0012 上午 10:25

def demo1():
    a = 'demo1'
    return a

def demo2():
    a = 'demo2'
    demo1()


res = demo2()
print(res)
