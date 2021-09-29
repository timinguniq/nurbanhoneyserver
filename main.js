var express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello world1')
});

app.listen(80, function(){
    console.log('Example app listening on port 3000!')
});
