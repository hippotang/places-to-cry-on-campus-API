const https = require('https');

url = 'localhost:1337'
https.get(url+'/m/BOELTER/851/2', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(JSON.parse(data))
    })
})
