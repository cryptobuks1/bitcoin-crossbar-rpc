import aiohttp, asyncio, json
from autobahn.asyncio.wamp import ApplicationSession, ApplicationRunner

async def fetch(session, url, rpcMethod='help', params=[]):
        payload = json.dumps({"method": rpcMethod, "params": list(params), "jsonrpc": "2.0"})
        headers = {'content-type': 'application/json'}
        async with  session.post(url, data=payload) as response:
            return await response.text()

class Component(ApplicationSession):

    async def onJoin(self, details):

        async def callRPC(command, params=[]):
            rpcUser = 'bitcoind'
            rpcPassword = 'BTCPythonCrossbar2019'
            rpcPort = 8332

            async with aiohttp.ClientSession() as session:
                result = await fetch(session, 'http://' + rpcUser + ':' + rpcPassword + '@localhost:' + str(rpcPort), command, params)
                print(result)
                return result

        await self.register(callRPC, u'com.myapp.bitcoin')
        print("Registered methods; ready for frontend.")


if __name__ == '__main__':
    import six
    url = u"ws://127.0.0.1:8080/ws"
    if six.PY2 and type(url) == six.binary_type:
        url = url.decode('utf8')
    realm = u"realm1"
    runner = ApplicationRunner(url, realm)
    runner.run(Component)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())

