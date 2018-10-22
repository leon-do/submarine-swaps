// private configs
const private = require('./private')

// server
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// lightning
const lnService = require('ln-service')
const createInvoice = require('ln-service/createInvoice')
const decodePaymentRequest = require('ln-service/decodePaymentRequest')
const lnd = lnService.lightningDaemon({
  cert: private.CERT,
  macaroon: private.MACAROON,
  socket: 'localhost:10009',
})

// ethereum
const deployContract = require('./eth/deployContract')
const unlockContract = require('./eth/unlockContract')

// shitty database
const shittyDb = {
  '208a42118b2f812aef8cc387a75d1c97568aae457c92f33cebf1971bdb318a28': {
    contractAddress: '0xf89b56767208cE46E09F0DBbaC264CADA32Ec616',
    bytecode: 111,
    abi: [123, 456]
  }
}

app
.use(bodyParser.json())
.post('/', async (req, res) => {
  // verify body
  const client = req.body

  // create bitcoin invoice
  const invoice = await createInvoice({
    lnd,
    tokens: client.bitcoin * 100000000, // 100000000 satoshis = 1 btc
    create_at: new Date(Date.now() + 1000 * 60 * 60) // invoice expires in 1 hour
  })
  console.log({invoice})

  // decode bitcoin invoice
  const decodedPaymentRequest = await decodePaymentRequest({
    lnd,
    request: invoice.request
  })
  console.log({decodedPaymentRequest})

  // create ethereum contract using the same hash from the bitcoin invoice
  const ethContract = await deployContract({
    toAddress: client.ethAddress,
    hash: decodedPaymentRequest.id,
    value: client.bitcoin // assuming the rate is 1:1
  })
  console.log({ethContract})

  // save to "database"
  shittyDb[invoice.secret] = {
    secret: invoice.secret,
    contractAddress: ethContract.address,
    abi: ethContract.abi
  }

  // respond back to client payment request and eth contract
  return res.send({
    paymentRequest: invoice.request,
    decodedPaymentRequest,
    ethContractAddress: ethContract.address
  })
})

// listen to invoices
lnService.subscribeToInvoices({lnd}).on('data', async (invoiceRes) => {
  // doing the client a favor and unlocking my own eth contract...smh
  const secret = invoiceRes.secret
  const unlockedTx = await unlockContract({
    secret,
    contractAddress: shittyDb[secret].contractAddress,
    abi: shittyDb[secret].abi,
  })
  console.log({unlockedTx})
})

app.listen(3000, () => console.log('listneing on port 3000'))
