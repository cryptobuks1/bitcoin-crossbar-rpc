import asyncio
from os import environ
from autobahn.asyncio.wamp import ApplicationSession, ApplicationRunner
from bitcoinrpc.authproxy import AuthServiceProxy, JSONRPCException
import json

class Component(ApplicationSession):
    """
    An application component providing procedures with different kinds
    of arguments.
    """

    async def onJoin(self, details):

        rpc_user, rpc_password = "name" , "password"
        rpc_connection = AuthServiceProxy("http://%s:%s@127.0.0.1:8332"%(rpc_user, rpc_password))

        def callRPC(command):
            result = rpc_connection.getblockchaininfo()
            print("backend result: ")
            print(result)
            return result

        await self.register(callRPC, u'com.myapp.bitcoin')
        print("Registered methods; ready for frontend.")


if __name__ == '__main__':
    import six
    url = environ.get("AUTOBAHN_DEMO_ROUTER", u"ws://127.0.0.1:8080/ws")
    if six.PY2 and type(url) == six.binary_type:
        url = url.decode('utf8')
    realm = u"realm1"
    runner = ApplicationRunner(url, realm)
    runner.run(Component)