#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Auther: ZhengZhong,Jiang

import redis

class redisHelper:
    def __init__(self):
        self.__conn = redis.Redis(host='127.0.0.1')

    def public(self, msg, chan):
        self.__conn.publish(chan, msg)
        return True
    
    def subcribe(self, chan):
        pub = self.__conn.pubsub()
        pub.subcribe(chan)
        pub.parse_response()
        return pub

