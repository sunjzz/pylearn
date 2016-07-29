#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Auther: ZhengZhong,Jiang

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import create_engine

engine = create_engine("mysql+pymysql://root:python@12.12.11.140:3306/pylearn?charset=utf8", pool_size=5, max_overflow=5, echo=True)

Base = declarative_base()


class ServiceLine(Base):
    __tablename__ = 'serviceline'
    id = Column(Integer, primary_key=True, autoincrement=True)
    serline_name = Column(String(50))


class Host(Base):
    __tablename__ = 'host'
    id = Column(Integer, primary_key=True, autoincrement=True)
    hostip = Column(String(20))
    hostname = Column(String(50))
    serline_id = Column(Integer, ForeignKey('serviceline.id'))


# Base.metadata.drop_all(engine)
# Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()


class core:
    def __init__(self, self ):


# session.add_all([
#     ServiceLine(serline_name='QQ'),
#     ServiceLine(serline_name='WeChat'),
# ])

session.add_all([
    Host(hostip='12.12.11.40', hostname='python', serline_id=1),
    Host(hostip='127.0.0.1', hostname='jiang', serline_id=2),
])

session.commit()

