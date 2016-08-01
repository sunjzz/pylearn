#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Auther: ZhengZhong,Jiang

from sqlalchemy import create_engine,and_,or_,func,Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String,ForeignKey,UniqueConstraint,DateTime
from  sqlalchemy.orm import sessionmaker,relationship

Base = declarative_base()


class BUsers(Base):
    __tablename__ = 'b_users'
    b_user_id = Column(Integer, primary_key=True, autoincrement=True)
    b_username = Column(String(45))


class Groups(Base):
    __tablename__ = 'groups'
    group_id = Column(Integer, primary_key=True, autoincrement=True)
    group_name = Column(String(45))


class Hosts(Base):
    __tablename__ = 'hosts'
    host_id = Column(Integer, primary_key=True, autoincrement=True)
    host_name = Column(String(45))
    host_ip = Column(String(45))
    host_port = Column(Integer)


class Users(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(45))
    password = Column(String(45))
    logintype = Column(Integer)
    usercert = Column(String(150))


class Log(Base):
    __tablename__ = 'log'
    nid = Column(Integer, primary_key=True, autoincrement=True)
    b_user_id = Column(Integer, ForeignKey(BUsers.b_user_id))
    group_id = Column(Integer, ForeignKey(Groups.group_id))
    host_id = Column(Integer, ForeignKey(Hosts.host_id))
    user_id = Column(Integer, ForeignKey(Users.user_id))
    run_cmd = Column(String(500))
    run_date = Column(DateTime(100))


class BUserGroup(Base):
    __tablename__ = 'b_user_group'
    b_user_id = Column(Integer, ForeignKey(BUsers.b_user_id))
    group_id = Column(Integer, ForeignKey(Groups.group_id))


class GroupHost(Base):
    __tablename__ = 'group_host'
    group_id = Column(Integer, ForeignKey(Groups.group_id))
    host_id = Column(Integer, ForeignKey(Hosts.host_id))


class HostUser(Base):
    __tablename__ = 'host_user'
    host_id = Column(Integer, ForeignKey(Hosts.host_id))
    user_id = Column(Integer, ForeignKey(Users.user_id))