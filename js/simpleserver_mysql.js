//replace port 8080 below if you wish to change the server port
var serverport = 8080;

var http = require('http');
var qs = require('querystring');
var url = require('url');
var fs = require('fs');
var util = require('util');
var mime = require('C:\\Users\\Vikramsinh\\AppData\\Roaming\\npm\\node_modules\\mime');
var vidStreamer = require("C:\\Users\\Vikramsinh\\AppData\\Roaming\\npm\\node_modules\\vid-streamer");

var mydb = require('./mydb');

//write back result
writeResult = function (res, code, result, mimetype) {
    res.writeHead(code, {'Content-Type': mimetype, 'Content-Length': result.length});
    res.write(result);
    res.end();
}

// get getFilename from request using url
getFilename = function (req) {
    var filename = req.url.substring(1);
    if (!!filename)
        return filename;
    return "/";
}

// sendFile 
sendFile = function (filename, res) {
    if (filename[filename.length - 1] === '/')
        filename += 'index.html'
    fs.readFile(filename, function (err, data) {
        if (err) {
            writeResult(res, "404", "Page not found!", "text/plain");
            return;
        }
//    console.log('file: ' + filename + ' mime : ' + mime.lookup(filename));    
        writeResult(res, 200, data, mime.lookup(filename));
    });
}

// sendScores
sendScores = function (req, res) {
    var str = "<ul>"
            + "<li>Midterm</li><li>Peter [ 18 / 20 ]</li><li>Nancy [ 15 / 20 ]</li>"
            + "<li>Final</li><li>Peter [ 19 / 20 ]</li><li>Nancy [ 17 / 20 ]</li></ul>";
    writeResult(res, "200", str, "text/html");
}

// the GET handler
handleGet = function (req, res) {
    var filename = getFilename(req).replace(/%20/g, " ");

    if (req.url === "/") {
        writeResult(res, "200", "Welcome!", "text/plain");
    }
    else if (req.url === "/getScores") {
        sendScores(req, res);
    }
    else if (req.url === "/delay") {
        setTimeout(function () {
            sendFile('dummypage', res);
        }, 2000);
    }
    else if (req.url === '/getxml') {
        console.log("INCOMING REQUEST: " + req.method + " " + req.url);
        res.writeHead(200, {"Content-Type": "text/xml"});
        res.end("<order>12345</order>" + "\n");
    }
    else if (req.url === '/getPizzas') {
        mydb.getPizzas(res, getPizzas);
    }
    else if (req.url.indexOf("/getPizza") >= 0) {
        req.parsed_url = url.parse(req.url, true);
        var getp = req.parsed_url.query;

        var TypeOfPizza = getp.TypeOfPizza ? getp.TypeOfPizza : "";
        var SizeOfPizza = getp.SizeOfPizza ? getp.SizeOfPizza : "";
        var extra = getp.extra ? getp.extra : "";
        console.log("TypeOfPizza: " + TypeOfPizza);
        console.log("SizeOfPizza: " + SizeOfPizza);
        console.log("extra: " + extra);

        mydb.getPizza(res, TypeOfPizza, SizeOfPizza, extra, getPizza);
    }
    else if (req.url.indexOf("/resources/video") >= 0
            || req.url.indexOf("/resources/audio") >= 0) {
        vidStreamer(req, res);
    } else {
        sendFile(filename, res);
    }
}

//Handles /postAddPizza
addPizza = function (req, res) {
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var obj = qs.parse(body);
        var str = "<div><h1>Thanks for selecting Pizza </h1>"
                + "<div>" + obj.TypeOfPizza + " Of " +
                obj.SizeOfPizza + " size " + "</p>"
                + "</div></div>";

        writeResult(res, "200", str, "text/html");
        mydb.insertPizza(obj.TypeOfPizza, obj.SizeOfPizza, obj.extra, obj.qty);

    });
};

//Handles /postDeletePizza
deletePizza = function (req, res) {
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var obj = qs.parse(body);
        var str = "<div><h1>Sorry Hope you will Get Something Better !</h1>"
                + "</div>";

        writeResult(res, "200", str, "text/html");
        mydb.deletePizza();
    });
};

//Handles /postUpdatePizza
updatePizza = function (req, res) {
    var body = "";
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        var obj = qs.parse(body);
        var str = "<div><h1>Thanks for updating Cart!</h1>"
                + "</div>";

        writeResult(res, "200", str, "text/html");
        mydb.updatePizza(obj.TypeOfPizza, obj.SizeOfPizza, obj.extra, obj.qty, obj.PizzaID);
    });
};

cleanOrder = function () {
    mydb.deletePizza();
    mydb.deleteOrder();
    
};

// HTTP REQUEST HANDLERS
handlePost = function (req, res) {
    if (req.url === "/postComment") {
        addComment(req, res);
    } else if (req.url === "/postClean") {
        cleanOrder();
    }else if (req.url === "/postAddPizza") {
        addPizza(req, res);
    } else if (req.url === "/postUpdatePizza") {
        updatePizza(req, res);
    } else if (req.url === "/postDeletePizza") {
        deletePizza(req, res);
    } else {
        var str = "<h1>Server Response</h1>"
                + "Your post was successful!";
        writeResult(res, "200", str, "text/html");
    }
};

getPizzas = function (res, pizzas) {
    //util.log("INCOMING REQUEST: " + req.method + " " + req.url);
    res.writeHead(200, {"Content-Type": "text/html"});
    var content = '{ "pizzas" : ' + JSON.stringify(pizzas) + ' } \n';
    res.end(content);
};

getPizza = function (res, pizzas) {

    res.writeHead(200, {"Content-Type": "text/html"});
    var content = JSON.stringify(pizzas);
    res.end(content);
    util.log(content);
};

// Connect to DB first
mydb.connectDB();

// server starts here
http.createServer(function (req, res) {
    if (req.method === 'GET') {
        handleGet(req, res);
    }
    else
    if (req.method === 'POST') {
        handlePost(req, res);
    }
}).listen(serverport);
util.log('A Simple Node Server is running...');
