var express = require('express')
var WebSocket = require('ws');
var http = require('http');

var app = express()
// 静态文件
app.use(express.static('public'))
// respond with "hello world" when a GET request is made to the homepage

const cameraList = ["camera1","camera2","camera3","camera4"]
const imageList = [
    "https://publicdomainarchive.com/wp-content/uploads/2015/03/public-domain-images-free-stock-photos-1-wtc-architecture-city-1000x667.jpg",
    "https://publicdomainarchive.com/wp-content/uploads/2015/03/public-domain-images-free-stock-photos-apple-iphone-iphone-6-1000x667.jpg",
    "https://publicdomainarchive.com/img/ree-stock-photos-high-quality-resolution-downloads-public-domain-archive-10-1000x750-160436_1000x675_mrfjmxa4cagocwyenp2x0j.jpg",
    "https://publicdomainarchive.com/img/free-stock-photos-high-quality-resolution-downloads-public-domain-archive-3-1000x750-170064_1000x675_jqrmehmzh7b0s2ecsjebjo.jpg",
    "https://publicdomainarchive.com/img/public-domain-images-free-stock-photos-palma-fruits-sun-apartments-white-building-1000x673.jpg"
]


//initialize a simple http server
const server = http.createServer(app);


//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server , path: '/ws'});

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.action) {
                if (data.action === "cameraList"){
                    ws.send(JSON.stringify({ "action":data.action, data: cameraList }))
                    setInterval(()=>{
                        const cameraName = cameraList[Math.trunc(Math.random()*cameraList.length)]
                        const link = imageList[Math.trunc(Math.random()*imageList.length)]
                        ws.send(JSON.stringify({ "action":"image", data: {cameraName, link} }))
                    },500)
                    return;
                }
            }
            
        } catch (error) {
            
        }

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection    
    ws.send('Hi there, I am a WebSocket server');
});

server.listen(3000, ()=>{
    console.log("server start at",3000)
})