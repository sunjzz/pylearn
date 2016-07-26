### Redis( 续篇 )

redis 发布订阅

订阅者可以订阅一个或多个频道，发布者向一个频道发送消息后，所有订阅这个频道的订阅者都将收到消息，而发布者也将收到一个数值，这个数值是收到消息的订阅者的数量。订阅者只能收到自它开始订阅后发布者所发布的消息.



定义类(假设定义类文件名为myredis):

```
import redis

class RedisHelper:
	def __init__(self):
		self.conn=redis.Redis(host='12.12.11.140')
		
	def public(self, chan, msg):
		self.conn.publish(chan,msg)
		return True
		
	def subscribe(self, chan):
		pub = self.conn.pubsub()
		pub.subscribe(chan)
		pub.parse_response()
		return pub
```

发布者:

```
import myredis

obj = myredis.redisHelper()
obj.public('hello!', 'fm103.7')
```

订阅者:

```
import myredis

obj = myredis.redisHelper()
data = obj.subscribe('fm103.7')
print(data.parse_reponse())
```
### RabbitMQ

RabbitMQ是一个在AMQP基础上完整的，可复用的企业消息系统。他遵循Mozilla Public License开源协议。MQ全称为Message Queue, [消息队列](http://baike.baidu.com/view/262473.htm)（MQ）是一种应用程序对应用程序的通信方法。应用程序通过读写出入队列的消息（针对应用程序的数据）来通信，而无需专用连接来链接它们。消 息传递指的是程序之间通过在消息中发送数据进行通信，而不是通过直接调用彼此来通信，直接调用通常是用于诸如[远程过程调用](http://baike.baidu.com/view/431455.htm)的技术。排队指的是应用程序通过 队列来通信。队列的使用除去了接收和发送应用程序同时执行的要求。

RabbitMQ是由LShift提供的一个Advanced Message Queuing Protocol (AMQP)的开源实现，由以高性能、健壮以及可伸缩性出名的Erlang写成（因此也是继承了这些优点）。

首先介绍AMQP和一些基本概念：
当前各种应用大量使用异步消息模型，并随之产生众多消息中间件产品及协议，标准的不一致使应用与中间件之间的耦合限制产品的选择，并增加维护成本。AMQP是一个提供统一消息服务的应用层标准协议，基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同开发语言等条件的限制。当然这种降低耦合的机制是基于与上层产品，语言无关的协议。AMQP协议是一种二进制协议，提供客户端应用与消息中间件之间异步、安全、高效地交互。
从整体来看，AMQP协议可划分为三层。这种分层架构类似于OSI网络协议，可替换各层实现而不影响与其它层的交互。AMQP定义了合适的服务器端域模型，用于规范服务器的行为(AMQP服务器端可称为broker)。
Model层决定这些基本域模型所产生的行为，这种行为在AMQP中用”command”表示，在后文中会着重来分析这些域模型。  

Session层定义客户端与broker之间的通信(通信双方都是一个peer，可互称做partner)，为command的可靠传输提供保障。 
Transport层专注于数据传送，并与Session保持交互，接受上层的数据，组装成二进制流，传送到receiver后再解析数据，交付给Session层。Session层需要Transport层完成网络异常情况的汇报，顺序传送command等工作。  

AMQP当中有四个概念非常重要：虚拟主机（virtual host），交换机（exchange），队列（queue）和绑定（binding）。  

虚拟主机（virtual host）：一个虚拟主机持有一组交换机、队列和绑定。为什么需要多个虚拟主机呢？RabbitMQ当中，用户只能在虚拟主机的粒度进行权限控制。因此，如果需要禁止A组访问B组的交换机/队列/绑定，必须为A和B分别创建一个虚拟主机。每一个RabbitMQ服务器都有一个默认的虚拟主机“/”。  

队列（Queue）：由消费者建立的，是messages的终点，可以理解成装消息的容器。消息一直存在队列里，直到有客户端或者称为Consumer消费者连接到这个队列并将message取走为止。队列可以有多个。  

交换机（Exchange）：可以理解成具有路由表的路由程序。每个消息都有一个路由键（routing key），就是一个简单的字符串。交换机中有一系列的绑定（binding），即路由规则（routes）。交换机可以有多个。多个队列可以和同一个交换机绑定，同时多个交换机也可以和同一个队列绑定。（多对多的关系）  

三种交换机：  
1. Fanout Exchange（不处理路由键）：一个发送到交换机上的消息都会被转发到与该交换机绑定的所有队列上。Fanout交换机发消息是最快的。  
2. Direct Exchange（处理路由键）：如果一个队列绑定到该交换机上，并且当前要求路由键为X，只有路由键是X的消息才会被这个队列转发。  
3. Topic Exchange（将路由键和某模式进行匹配，可以理解成模糊处理）：路由键的词由“.”隔开，符号“#”表示匹配0个或多个词，符号“\*”表示匹配不多不少一个词。因此“  audit.#”能够匹配到“audit.irs.corporate”，但是“  audit.*”只会匹配到“audit.irs”  

持久化：队列和交换机有一个创建时候指定的标志durable，直译叫做坚固的。durable的唯一含义就是具有这个标志的队列和交换机会在重启之后重新建立，它不表示说在队列当中的消息会在重启后恢复。那么如何才能做到不只是队列和交换机，还有消息都是持久的呢？  

但是首先一个问题是，你真的需要消息是持久的吗？对于一个需要在重启之后回复的消息来说，它需要被写入到磁盘上，而即使是最简单的磁盘操作也是要消耗时间的。如果和消息的内容相比，你更看重的是消息处理的速度，那么不要使用持久化的消息。  

当你将消息发布到交换机的时候，可以指定一个标志“Delivery Mode”（投递模式）。根据你使用的AMQP的库不同，指定这个标志的方法可能不太一样。简单的说，就是将 Delivery Mode设置成2，也就是持久的即可。一般的AMQP库都是将Delivery Mode设置成1，也就是非持久的。所以要持久化消息的步骤如下： 
1, 将交换机设成durable。 
2, 将队列设成durable。 
3, 将消息的Delivery Mode设置成2。  

绑定（Bindings）如何持久化？我们无法在创建绑定的时候设置成durable。没问题，如果绑定了一个durable的队列和一个durable的交换机，RabbitMQ会自动保留这个绑定。类似的，如果删除了某个队列或交换机（无论是不是durable），依赖它的绑定都会自动删除。  

注意两点： 
1, RabbitMQ不允许绑定一个非坚固（non-durable）的交换机和一个durable的队列。反之亦然。要想成功必须队列和交换机都是durable的。  

2, 一旦创建了队列和交换机，就不能修改其标志了。例如，如果创建了一个non-durable的队列，然后想把它改变成durable的，唯一的办法就是删除这个队列然后重现创建。因此，最好仔细检查创建的标志。

消息队列（MQ）使用过程 
几个概念说明： 
1,  Broker：简单来说就是消息队列服务器实体。 

2,  Exchange：消息交换机，它指定消息按什么规则，路由到哪个队列。 

3,  Queue：消息队列载体，每个消息都会被投入到一个或多个队列。

4,  Binding：绑定，它的作用就是把exchange和queue按照路由规则绑定起来。 

5,  Routing Key：路由关键字，exchange根据这个关键字进行消息投递。  

6,  vhost：虚拟主机，一个broker里可以开设多个vhost，用作不同用户的权限分离。 

7,  producer：消息生产者，就是投递消息的程序。 

8,  consumer：消息消费者，就是接受消息的程序。  

9,  channel：消息通道，在客户端的每个连接里，可建立多个channel，每个channel代表一个会话任务。  

消息队列的使用过程大概如下：  

1,  客户端连接到消息队列服务器，打开一个channel。

2,  客户端声明一个exchange，并设置相关属性。 

3,  客户端声明一个queue，并设置相关属性。 

4,  客户端使用routing key，在exchange和queue之间建立好绑定关系。 

5,  客户端投递消息到exchange。 

6,  exchange接收到消息后，就根据消息的key和已经设置的binding，进行消息路由，将消息投递到一个或多个队列里。  

[官网下载](http://www.rabbitmq.com/download.html)

注意: 默认启动RabbitMQ是guest账户,处于安全的考虑，guest这个默认的用户只能本机访问，其他IP无法直接使用这个账号。 这对于服务器上没有安装桌面的情况是无法管理维护的，除非通过在前面添加一层代理向外提供服务，这个又有些麻烦了，这里通过配置文件来实现这个功能。只要编辑 /etc/rabbitmq/rabbitmq.config 文件，添加以下配置即可:

```
[{rabbit, [{loopback_users, []}]}].
```

注意后面的英文半角符号 **.**

安装好启动RabbitMQ,接下来就可以通过pika模块操作RabbitMQ了.

安装API

 `pip3 install pika`

前面我们使用Queue实现了生产者消费者模型.

对于RabbitMQ来说，生产和消费不再针对内存里的一个Queue对象，而是某台服务器上的RabbitMQ Server实现的消息队列。

生产者:

```
import pika

conn = pika.BlockingConnection(pika.ConnectionParameters(host='12.12.11.140'))
chan = conn.channel()

chan.queue_declare(queue='sayhello')
chan.basic_publish(exchange='', routing_key='sayhello', body='Hello World!')
print("[x] Sent 'Hello World!'")
conn.close()
```

消费者:

```
import pika

conn = pika.BlockingConnection(pika.ConnectionParameters(host='12.12.11.140'))
chan = conn.channel()
chan.queue_declare(queue='sayhello')

def callbak(ch, method, properties, body):
	print("[x] Received %r" % body)
	
channel.basic_consume(callback, queue='sayhello', no_ack=True)
print("[*] Waiting for messages. To exit press CTRL+C")
chan.start_consuming()
```

1, acknowledgment 消息不丢失

no_ack ＝ False，如果消费者遇到情况(its channel is closed, connection is closed, or TCP connection is lost)挂掉了，那么，RabbitMQ会重新将该任务添加到队列中。

消费者接受到消息则回复一个ack,没有回复ack则任务重新塞进消息队列

参考上例，将no_ack更改为False

2, durable 消息不丢失

队列任务持久化

生产者：

```
import pika

conn = pika.BlockingConnection(pika.ConnectionParameters(host='12.12.11.140'))
chan = connection.channel()

chan.queue_declare(queue='sayhello', durable=True)

chan.basic_pulish(exchange='', routing_key='oldboy', body='{"cmd": "ls", "queue_name": "operation"}', properties=pika.BasicProperties(delivery_mode=2))

print("[x] Sent 'Hello World!'")
conn.close()
```

消费者：

```
import pika

conn = pika.BlockingConnection(pika.ConnectionParameters(host='12.12.11.140'))
chan = connection.channel()

chan.queque_declare(queue='sayhello', durable=True)

def callback(ch, method, properties, body):
	print("[x] Received %r" % body)
	
chan.basic_consume(callback, queue='sayhello', no_ack=False)
	
print("[x] Waiting for messages. To exit press CTRL+C")
chan.start_consuming()
```

3, 消息获取顺序

默认消息队列里的数据是按照顺序被消费者拿走，例如：消费者1 去队列中获取 奇数 序列的任务，消费者1去队列中获取 偶数 序列的任务。

channel.basic_qos(prefetch_count=1) 表示谁来谁取，不再按照奇偶数排列

消费者：

```
import pika

conn = pika.BlockingConnectiong(pika.ConnectionParameters(host='12.12.11.140'))
chan = conn.channel()

chan.queue_declare(queue='sayhello')

def callback(ch, method, properties, body):
	print("[x] Received %r" % body)
	ch.basic_ack(delivery_tag = method.delivery_tag)

chan.basic_qos(prefetch_count=1)

chan.basic_consume(callback, queue='hello', no_ack=False)

print('[x] Waiting for messages. To exit press CTRL+C.')
chan.start_consuming()
```

4, 发布订阅

发布订阅和简单的消息队列区别在于，发布订阅会将消息发送给所有的订阅者，而消息队列中的数据被消费一次便消失。所以，RabbitMQ实现发布和订阅时，会为每一个订阅者创建一个队列，而发布者发布消息时，会将消息放置在所有相关队列中。

 exchange type = fanout

生产者：

```
import pika

conn = pika.BlockingConnection(pika.ConnectionParameters(hosts='12.12.11.140'))
chan = conn.channel()
chan.exchange_declare(exchange='logs', type='finout')

message = 'Hello World!'
chan.basic_publish(exchange='logs', routing_key='', body=message)
print("[x] Send %r" % message)
conn.close()
```

消费者：

```
import pika

conn = pika.BlokingConnection(pika.ConnectionParameters(host='12.12.11.140'))
chan = conn.channel()
chan.exchange_declare(exchange='logs', type='finout')

result = chan.queue_declare(exclusive=True)
queue_name = result.method.queue

chan.queue_bind(exchange='logs', queue=queue_name)
print("[x] Waiting for logs. To exit Press CTRL+C.")

def callback(ch, method, properties, body):
	print("[x] %r" % body)

chan.basic_consume(callback, queue=queue_name, no_ack=True)
chan.start_consuming()
```

5, 关键字匹配

exchange type = direct

之前示例，发送消息时明确指定某个队列并向其中发送消息，RabbitMQ还支持根据关键字发送，即：队列绑定关键字，发送者将数据根据关键字发送到消息exchange，exchange根据关键字判定应该将数据发送至指定队列。

```
import pika
conn = pika.BlocakingConnection(pika.ConnectionParameters(host='12.12.11.140'))
chan = conn.channel()

chan.exchange_declare(exchange='sayhello', type='direct')
r

```

