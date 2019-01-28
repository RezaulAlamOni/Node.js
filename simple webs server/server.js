//require
const http  = require('http');
var url     = require('url');
var path    = require('path');
var fs      = require('fs');

//array of mime type

var mineTypes = {
    "html" :"text.html",
    "jpeg" :"image/jpeg",
    "jpg" :"image/jpg",
    "png" :"image/png",
    "js" :"text/javascript",
    "css" :"text/css",
};

http.createServer(function (req,res) {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(),unescape(uri));
    console.log("loading"+uri);
    var stats;
    try {
        stats = fs.lstatSync(fileName);
    }catch(e){
        res.writeHead(404,{'content-type': 'text:plain'});
        res.write('404 not found\n');
        res.end();
        return;
    }

    if(stats.isFile()){
        var mineType = mineTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200,{'Content-type':mineType});

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    }else if(stats.isDirectory()){
        res.writeHead(302,{
            'Location':'index.html'
        });
    }else{
        res.writeHead(500,{'Content-type':'text/plain'});
        res.write('500 internal Error\n');
        res.end();
    }

}).listen(3000);