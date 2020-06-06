
const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const home = fs.readFileSync('./index.html');
const admin = fs.readFileSync('./admin.html');
const bank = fs.readFileSync('./bank.html');
const donate = fs.readFileSync('./donate.html');
const medicine = fs.readFileSync('./medicine.html');
const fund = fs.readFileSync('./fund.html');


const server = http.createServer((req,res)=>{
    console.log(req.url);
    url = req.url;


    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    if(url == '/'){
    res.end(home);
    }

    else if(url == '/admin'){
        res.end(admin);
    }
    else if(url == '/bank'){
        res.end(bank);
    }
    else if(url == '/donate'){
        res.end(donate);
    }
    else if(url == '/medicine'){
        res.end(medicine);
    }
    else if(url == '/fund'){
        res.end(fund);
    }
    else{
        res.statusCode = 404;
        res.end("<h1>404 not found</h1>");
    }

});
 server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
 });

