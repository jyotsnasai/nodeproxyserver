
"use strict"
let http = require('http')
let fs = require('fs')
let request = require ('request')
let argv = require('yargs')
//let destinationUrl = '127.0.0.1:8000'
var logStream = argv.logfile ? fs.createWriteStream(argv.logfile) 
:process.stdout

let localhost ='127.0.0.1'
let host = argv.host || localhost
let port = argv.port || (host === localhost ? 8000 :80)

let scheme = 'http://'
var destinationUrl = scheme + host + ':' + port



var echoServer= http.createServer((req, res) => {
	logStream.write('echoServer \n')
	for (let header in req.headers) {
    res.setHeader(header, req.headers[header])
}
 logStream.write(JSON.stringify(req.headers) + '\n')
req.pipe(res)
})
echoServer.listen(9000)
logStream.write('echoserver listening to 9000 \n')

 var proxyServer = http.createServer((req,res) => {
	logStream.write('proxyserver \n')
	logStream.write(JSON.stringify(req.headers) + '\n')
	var url = destinationUrl
	if(req.headers['x-destination-url']){
	 url = 'http://' + req.headers['x-destination-url'] 
}
	let options = {
     
        url: url +req.url
    }
    //request(options)
    req.pipe(request(options)).pipe(res)
})
proxyServer.listen(8001)
logStream.write('proxyserver listening to 8001\n')
