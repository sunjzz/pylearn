# Author:Alex Li
import pika

# ######################### 生产者 #########################

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='12.12.11.140'))
channel = connection.channel()

channel.queue_declare(queue='hello1')

channel.basic_publish(exchange='',
                      routing_key='hello1',
                      body='Hello World!')
print(" [x] Sent 'Hello World!'")
connection.close()