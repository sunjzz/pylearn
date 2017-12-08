# -*- coding: utf-8 -*-
# @author ZhengZhong,Jiang
# @time 2017/12/7 9:24

import datetime

import xlrd
from xlutils.copy import copy
import configparser

nowtime = datetime.datetime.now().strftime('%Y%m%d')


def copyNewSheet():
    rb = xlrd.open_workbook('mmc_db_check.xls', formatting_info=True)
    wb = copy(rb)
    rs = rb.sheet_by_index(0)
    wb.add_sheet(nowtime)
    ws = wb.get_sheet(-1)
    for row in range(rs.nrows):
        for col in range(rs.ncols):
            ws.write(row, col, rs.cell_value(row, col))
    wb.save('mmc_db_check.xls')


def putNewValue():
    pass

if __name__ == '__main__':
    copyNewSheet()
