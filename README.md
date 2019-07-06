## Setup

`$ btcd --testnet --rpcuser=REPLACEME --rpcpass=REPLACEME`

`$ lnd --bitcoin.active --bitcoin.testnet --debuglevel=debug --btcd.rpcuser=REPLACEME --btcd.rpcpass=REPLACEME --externalip=127.0.0.1:18334`

`$ lncli -n testnet create`

`$ lncli -n testnet unlock`

## ln-service

`$ node app.js`

client has bitcoin and wants ethereum. sends request
![](https://i.imgur.com/WZrFuzg.png)

server generates invoice:
```
{ chain_address: undefined,
     created_at: '2018-12-28T20:56:42.069Z',
     description: undefined,
     id: '685db6a78d5af37aae9cb7531ffc034444a562c774e54a73201cc17d7388fcbd',
     request: 'lntb10n1pwzdrs2pp5dpwmdfudtteh4t5ukaf3llqrg3z22ck8wnj55ueqrnqh6uuglj7sdqqcqzystyjwn8lk97vt5gupnxfw76ytt4m7jsjkq20fu09j9jdnqugr0etzv6aqjl4esrqvpxpydw9t2elg5qun6zzhwsdu5pdraty9kmg07lsqtgmfl7',
     secret: 'c104ac676ab0b9005222043de34195f6666d92382e1e161eac7c9358f6eddeb0',
     tokens: 1,
     type: 'invoice' }
```

response
![](https://i.imgur.com/p4PF7Q6.png)

```
{
    "paymentRequest": "lntb1230n1pdu64typp5s2tn0vafar60tqt8lucst5s3mm07cexdmlqfz3zzsdvjh80a4sfqdqqcqzysuuxuj0tnwa4xx7uvpd8fpcdj5mlxufd3y9kmsk8nvmny9fluhmcqdgedealayl7su729kry29ex7ffwxm3ystxxngekgwzm8yy6a5nsqgqg6fe",
    "decodedPaymentRequest": {
        "routes": [],
        "created_at": "2018-10-22T04:43:16.000Z",
        "description": "",
        "description_hash": "",
        "destination": "024527cb12f8bb225a4924ef53cfb5eb6dda9830f739bca341728bf41b1e5ded7c",
        "expires_at": "2018-10-22T05:43:16.000Z",
        "id": "829737b3a9e8f4f58167ff3105d211dedfec64cddfc091444283592b9dfdac12",
        "minimum_final_htlc_cltv_delta": "144",
        "tokens": 123,
        "type": "payment_request"
    },
    "ethContractAddress": "0x118f47B7Bd5D4EB6EDF8cF0FD85f6775b44fFd3d"
}
```

client verifies eth contract address: 0x118f47B7Bd5D4EB6EDF8cF0FD85f6775b44fFd3d

![](https://i.imgur.com/PzoYMaG.png)

once verified, client pays btc paymentRequest

![](https://i.imgur.com/QKfNbAy.png)

client checks eth balance

![](https://i.imgur.com/OgGxysH.png)

fin
