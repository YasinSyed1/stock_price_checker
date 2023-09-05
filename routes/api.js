'use strict';
module.exports = function (app) {

  const express = require('express');
  const bodyParser = require('body-parser');
  const mongoose = require('mongoose');
  const IP = require('ip')

  mongoose.connect('mongodb+srv://yasin:Cn6xWFS8bFZtHtzB@cluster0.xq3pmsg.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
  
  const STOCKschema = {
    "stock": {type: String, required: true},
    "likes": {type: Number, required: true},
    "IP": {type: String, required: true},
    "like": {type: String}
  };

  var stock = mongoose.model('stock', STOCKschema);
  app.use(bodyParser.urlencoded({ extended: true }));

  
  app.get('/api/stock-prices?', (req,res) => {
    
    var s = req.query.stock
    if(typeof s == 'string'){
      s = s.toUpperCase()
    }
    var like = req.query.like
    // console.log("Likes: " + typeof like)
    var ipAddress = IP.address();
    // console.log(ipAddress)

    if(!Array.isArray(s)){

      var likes_count = 0
      var price = null
      async function getapi(s) {
        
        var url = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${s}/quote`
        const response = await fetch(url);
        var data = await response.json();
        // console.log(data);
        price = data.latestPrice
        // console.log(price)


        stock.findOne({stock: s}, (err, data) => {


          // For entering new data
            if(err || data == null) {
              console.log("New Data")
              if (like == 'true'){
                likes_count = 1
                var new_stock = new stock({"stock": s, "likes": 1, "IP": ipAddress, like: 'true'})
              }
              else{
                var new_stock = new stock({"stock": s, "likes": 0, "IP": ipAddress, like: 'false'})
              }

              new_stock.save((err, data) => {
                console.log("Saved")
              })


            }
            else{
              console.log("Updating....")
              likes_count = data.likes
              if (like == 'true' && data.like == 'false'){
                  likes_count += 1

                  stock.findOneAndUpdate({"stock": s}, {"likes":likes_count},{new: true},(err, data) => {
                    if (err) return err
                    console.log("Updated")
                    // console.log(data)
                })
              }

            }
            

            res.json({"stockData":{"stock": s, "price": price, "likes": likes_count}})

        })
      }
      getapi(s)
    }

    else{
      // console.log("twoooooooooooo")
      var likes_count1 = 0
      var likes_count2 = 0
      var price1 = null
      var price2 = null
      async function getapi(s) {
        
        var url1 = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${s[0]}/quote`
        var url2 = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${s[1]}/quote`
        const response1 = await fetch(url1);
        const response2 = await fetch(url2);
        var data1 = await response1.json();
        var data2 = await response2.json();
        // console.log(data);
        price1 = data1.latestPrice
        price2 = data2.latestPrice
        // console.log(price1)
        // console.log(price2)


        stock.findOne({stock: s[0]}, (err, data) => {


          // For entering new data
            if(err || data == null) {
              console.log("---New Data---")
              if (like == 'true'){
                likes_count1 = 1
                var new_stock1 = new stock({"stock": s[0], "likes": 1, "IP": ipAddress, "like": 'true'})
              }
              else{
                var new_stock1 = new stock({"stock": s[0], "likes": 0, "IP": ipAddress, "like": 'false'})
              }
              console.log("Saving new data...")

              new_stock1.save((err, data) => {
                console.log("Saved")
              })

            }
            // For updating existing data
            else{
              console.log("Updating existing data...")
              likes_count1 = data.likes
              if (like == 'true' && data.like == 'false'){
                likes_count1 += 1

                  stock.findOneAndUpdate({"stock": s[0]}, {"likes":likes_count1},{new: true},(err, data) => {
                    if (err) return err
                    console.log("Updated")
                    // console.log(data)
                })
              }

            }
            

            // res.json({"stockData":{"stock": s, "price": price, "likes": likes_count}})
            stock.findOne({stock: s[1]}, (err, data) => {


              // For entering new data
                if(err || data == null) {
                  console.log("New Data")
                  if (like == 'true'){
                    likes_count2 = 1
                    var new_stock2 = new stock({"stock": s[1], "likes": 1, "IP": ipAddress, "like": 'true'})
                  }
                  else{
                    var new_stock2 = new stock({"stock": s[1], "likes": 0, "IP": ipAddress, "like": 'false'})
                  }
    
                  new_stock2.save((err, data) => {
                    console.log("Saved")
                  })
    
    
                }
                else{
                  console.log("Updating....")
                  likes_count2 = data.likes
                  if (like == 'true' && data.like == 'false'){
                    likes_count2 += 1
    
                      stock.findOneAndUpdate({"stock": s[1]}, {"likes":likes_count2},{new: true},(err, data) => {
                        if (err) return err
                        console.log("Updated")
                        // console.log(data)
                    })
                  }
    
                }
                
    
                // res.json({"stockData":{"stock": s, "price": price, "likes": likes_count}})
                res.json({
                  "stockData": [
                      {
                          "stock": s[0],
                          "price": price1,
                          "rel_likes": likes_count1 - likes_count2
                      },
                      {
                          "stock": s[1],
                          "price": price2,
                          "rel_likes": likes_count2 - likes_count1
                      }
                  ]
                })
    
                
    
            })

            

        })
      }
      getapi(s)
      
    }


  })
    
};

