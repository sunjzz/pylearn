# _*_ coding: utf-8 _*_
# @Author ZhengZhong,Jiang
# @DataTime 2017/4/21 0021 上午 10:40

import xlrd, xlwt

rbook = xlrd.open_workbook('demo.xlsx')

rsheet = rbook.sheet_by_index(0)

nc = rsheet.ncols

rsheet.put_cell(0, nc, xlrd.XL_CELL_TEXT, u'总分', None)

for row in range(1, rsheet.nrows):
    # 第N行 跳过第一个单元格 求和
    t = sum(rsheet.row_values(row, 1))
    rsheet.put_cell(row, nc, xlrd.XL_CELL_NUMBER, t, None)

wbook = xlwt.Workbook()
wsheet = wbook.add_sheet(rsheet.name)
style = xlwt.easyxf('align: vertical center, horizontal center' )
for r in range(rsheet.nrows):
    for c in range(rsheet.ncols):
        wsheet.write(r, c, rsheet.cell_value(r, c), style)
wbook.save('output.xls')


for x in y:


