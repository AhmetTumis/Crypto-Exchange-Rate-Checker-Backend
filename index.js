let request = require('request');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');

app.get("/", function(req,res){
    res.render("home");
});

app.post('/checkmarket', function(req,res){

    let marketName = req.body.marketname;
    let redirectAddress = "/market/" + marketName;
    res.redirect(redirectAddress);
});

app.get("/markets", function(req,res){

    request('https://api.thodex.com/v1/public/markets', function(error, response,body){

        if(!error && response.statusCode == 200){

            let data = JSON.parse(body);
            console.log(typeof(data.result));
            data.result.forEach((result) => {
                console.log("Market adı: ", result.keyname, "Stock adı: ", result.stock_fullname);
            });
            res.send(data);
        } else {
            console.log("something went wrong");
            console.log(error);
            res.send("eyyy noo problemo!");
        };
    });
});

app.get("/market/:marketName", function(req,res){

    let name = req.params.marketName;
    let getThis = 'https://api.thodex.com/v1/public/market-status?market=' + name;
    console.log("This dude requested /market/", req.params.marketName);

    request(getThis, function(error, response,body){

        if(!error && response.statusCode == 200){

            let data = JSON.parse(body);
            console.log(data);
            console.log(typeof(data.result));
            res.send(data);
        } else {
            console.log("something went wrong");
            console.log(error);
            res.send("oopsie daisy there was a problem");
        };
    });
});

app.get("*", function(req,res){
    res.send("yeah no there ain't nothing here!");
    console.log(req.ip);
    console.log(" this guy requested a no no page");
});

app.listen(80,function(){
    console.log("server has started at port 80!");
});