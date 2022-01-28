var express = require('express');
const axios = require('axios');
var router = express.Router();
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getResponse(apiUrl) {
    let response = await axios.get(apiUrl);
    if (response.data.includes('amounts of traffic coming from your network, please try again later')) {
        await sleep(10000);
        return getResponse(apiUrl)
    }
    return response.data;
}
/* GET home page. */
router.get('/holders/:address', async function(req, res, next) {
    const tokenAddress = req.params.address;
    const apiurl = `https://bscscan.com/token/${tokenAddress}`;
    let response = '';
    try {
        response = await getResponse(apiurl);
        const holder_str = response.match(/(?<!\d,)(?<!\d)\d{1,3}(?:,\d{3})*(?!,?\d) addresses/);
        res.json({
            count: parseInt(holder_str[0].split(' ')[0].replace(/,/g, ''))
        })
    } catch (e) {
        res.json({
            html: response.data,
            message: e.message,
            count: 0
        })
    }
});

module.exports = router;
