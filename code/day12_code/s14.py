# Author:Alex Li
import pika
import sys

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='192.168.11.87'))
channel = connection.channel()
channel.exchange_declare(exchange='direct_logs_test_1',
                         type='direct')
result = channel.queue_declare(exclusive=True)
queue_name = result.method.queue
severities = ['error',]
for severity in severities:
    channel.queue_bind(exchange='direct_logs_test_1',
                       queue=queue_name,
                       routing_key=severity)
print(' [*] Waiting for logs. To exit press CTRL+C')

def callback(ch, method, properties, body):
    print(" [x] %r:%r" % (method.routing_key, body))
channel.basic_consume(callback,
                      queue=queue_name,
                      no_ack=True)
channel.start_consuming()