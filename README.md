# bitcoin-crossbar-rpc

There are 4 main parties involved:
1. Crossbar.io router (Python)
2. Bitcoin Node (C++)
3. Backend RPC connector (Node)
4. Frontend RPC caller (JS)

### Get Started
- npm install
- npm run build

### BACKEND
Node v8.12.0 or higher. 

Run:

` cd backend `

` node bitcoinRPCbackend.js`

Takes the following arguments:

```
--rpcusername=your_user_name
--rpcpassword=your_password
--rpcport=1234   (default: 8332)
--host=127.0.0.1 (dafault: localhost)
--appname=com.myapp.bitcoin (default)
```

### FRONTEND (Terminal simmulator)
Run:
`npm start`
