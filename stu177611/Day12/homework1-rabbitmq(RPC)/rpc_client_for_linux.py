#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Auther: ZhengZhong,Jiang

import pika
import uuid
import sys


class Rpcclient(object):
    def __init__(self):
        self.conn = pika.BlockingConnection(pika.ConnectionParameters(host='12.12.11.140'))
        self.chan = self.conn.channel()

        result = self.chan.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue

        self.chan.basic_consume(self.on_response, no_ack=True, queue=self.callback_queue)

    def on_response(self, ch, method, props, msg):
        if self.corr_id == props.correlation_id:
            self.reponse = msg

    def call(self, cmd):
        self.reponse = None
        self.corr_id = str(uuid.uuid3(uuid.NAMESPACE_OID, self.callback_queue))
        self.chan.basic_publish(exchange='',
                                routing_key='rpc_queue',
                                properties=pika.BasicProperties(
                                    reply_to=self.callback_queue,
                                    correlation_id=self.corr_id,),
                                body=str(cmd))

        while self.reponse == None:
            self.conn.process_data_events()
        return str(self.reponse, encoding='utf8')

cmd_rpc = Rpcclient()

command = input('Please input Command >>> ').strip()
print("[x] Requesting cmd '%s'" % command)

response = cmd_rpc.call(command)
print("[.] Got %r \n %s " % (command, response))



