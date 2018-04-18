var http = require("http");
var fs = require('fs');
var path = require('path');
var unirest = require('unirest');
var config = require('config');

function serveFiles(request, response){
    //console.log('request starting...');

    var filePath = './static/' + request.url;
    if (filePath == './static/')
        filePath = './static/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
}

function sendSpaceapiUpdate(api) {
    unirest.post(config.get('spaceapi.server') + "/spaceapi")
        .headers({'X-Auth-Token': config.get('spaceapi.token'), 'Content-Type': 'application/json'})
        .send(JSON.stringify(api))
        .end()
}


http.createServer(function(req,res){
    console.log(req.method + " " + req.url);    


    if (req.method == 'GET' && req.url == '/toggle'){
        console.log("Toggling state!");
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}', 'utf-8');


        unirest.get(config.get('spaceapi.server') + "/spaceapi")
            .end(function (response) {
                
                if (response.statusType == 2){              
                    var responseData = JSON.parse(response.body);            

                    sendSpaceapiUpdate({
                        state:{
                            open: !responseData.state.open,
                            lastchange: Date.now()
                        }
                    })
                }                
            })

    } else {
        serveFiles(req, res);
    }

}).listen(8080);