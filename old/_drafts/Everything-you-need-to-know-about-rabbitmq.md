---
layout: post
title: "Everything you need to know about RabbitMQ"
categories: [WebDevelopment]
tags: [rabbitmq, amqp]
---

1. Messages are not published direct to queues. The producer always send to an exchange.
2. Exchanges (message routing agents) route messages to the correct queue(s).
3. Exchanges route messages using bindings and routing keys.
4. Binding is a link between a queue and an exchange
5. Exchanges can be of many types (direct, topic, fanout, headers)
6. A queue only receives messages if it is bound to an exchange through a binding
7. Routing key is a key the exchange looks at to decide how to route the message to queues (destination address)  
8. Concepts:
    Producer, Consumer, Queue, Message, Connection, Channel, Exchange, Binding, Routing Key, 
    AMQP, Users, VHost, Ack and Confirms.
9. RabbitMQ speaks the AMQP protocol by default
10. Separate your Projects and Environments Using Vhosts 


