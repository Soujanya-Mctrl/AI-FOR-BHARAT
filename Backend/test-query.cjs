const express = require('express');
const app = express();
app.get('/', (req, res) => {
    let q = req.query;
    Object.defineProperty(req, 'query', {
        get: () => q, set: v => { q = v; }, configurable: true
    });
    try {
        req.query = { a: 1 };
        console.log("Success! req.query is:", req.query);
    } catch (e) {
        console.log("Error still:", e.message);
    }
    res.end('ok');
});
app.listen(3002, () => console.log('port 3002'));
