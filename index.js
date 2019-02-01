const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function(req,res){ 
    res.write('( o Y o )');	
    res.end();
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
