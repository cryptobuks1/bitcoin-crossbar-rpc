import asyncio
from os import environ
from autobahn.asyncio.wamp import ApplicationSession, ApplicationRunner
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException

class Component(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """

    async def onJoin(self, details):

        rpc_user, rpc_password = "name" , "password"
        rpc_connection = AuthServiceProxy("http://%s:%s@127.0.0.1:8332"%(rpc_user, rpc_password))

        def callRPC(command, params):
            return(rpc_connection[command](params))

        await self.register(callRPC, u'com.arguments.bitcoin')
        print("Registered methods; ready for frontend.")


if __name__ == '__main__':
    import six
    url = environ.get("AUTOBAHN_DEMO_ROUTER", u"ws://127.0.0.1:8080/ws")
    if six.PY2 and type(url) == six.binary_type:
        url = url.decode('utf8')
    realm = u"realm1"
    runner = ApplicationRunner(url, realm)
    runner.run(Component)

# from autobahn.asyncio.component import Component, run
# from autobahn.asyncio.util import sleep

# import asyncio
# import os
# import argparse
# import six
# import datetime

# url = os.environ.get('CBURL', u'ws://localhost:8080/ws')
# realmv = os.environ.get('CBREALM', u'realm1')
# print(url, realmv)
# # component = Component(transports=url, realm=realmv)


# #@component.register
# #def utcnow():
# #    now = datetime.datetime.utcnow()
# #    return now.strftime("%Y-%m-%dT%H:%M:%SZ")

# # @component.on_join

# async def joined(session, details):
#     print("session ready")

#     def utcnow():
#         now = datetime.datetime.utcnow()
#         return now.strftime("%Y-%m-%dT%H:%M:%SZ")

#     try:
#         yield session.register(utcnow, u'my.com.date')
#         print("procedure registered")
#     except Exception as e:
#         print("could not register procedure: {0}".format(e))

# loop = asyncio.get_event_loop()
# loop.run_forever()


# class MyComponent(ApplicationSession):

#     @inlineCallbacks
#     def onJoin(self, details):

#         rpc_user, rpc_password = "name" , "password"
#         rpc_connection = AuthServiceProxy("http://%s:%s@127.0.0.1:8332"%(rpc_user, rpc_password))

#         # 1. subscribe to a topic so we receive events
#         def onevent(msg):
#             print("Got event: {}".format(msg))

#         # yield self.subscribe(onevent, 'com.myapp.bitcoin')

#         # # 2. publish an event to a topic
#         # self.publish('com.myapp.hello', 'Hello, world!')

#         # 3. register a procedure for remote calling
#         def callRPC(command, params):
#             return(rpc_connection[command](params))

#         self.register(callRPC, 'com.myapp.bitcoin')

#         # 4. call a remote procedure
#         # res = yield self.call('com.myapp.add2', 2, 3)
#         # print("Got result: {}".format(res))
        
#         # best_block_hash = rpc_connection.getbestblockhash()

# # batch support : print timestamps of blocks 0 to 99 in 2 RPC round-trips:
# # commands = [ [ "getblockhash", height] for height in range(100) ]
# # block_hashes = rpc_connection.batch_(commands)
# # blocks = rpc_connection.batch_([ [ "getblock", h ] for h in block_hashes ])
# # block_times = [ block["time"] for block in blocks ]
# # print(block_times)