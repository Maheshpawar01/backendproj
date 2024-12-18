const http = require("http");
const port = 8000;

const server = http.createServer((req, res)=>{
    // console.log(req.url)

    if(req.url == "/" || req.url == "/home"){
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html')
        res.write('<h1>Hello world</h1>');
        res.end();
    }
    else if(req.url == '/about'){
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html')
        res.write('<h1>Hello about</h1>');
        res.end();
    }
    else if(req.url == '/practice'){
        res.statusCode = 200;
        res.write('<h1>This is practice page.</h1>')
    }
    else{
        res.statusCode = 404;
        res.setHeader('content-type', 'text/html')

        res.write('<h1>404 page not found</h1>');
        res.end();

    }
})

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

//how to create basic server