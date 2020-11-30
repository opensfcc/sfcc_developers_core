'use strict';

/**
 * Controller to handle AJAX Calls from Dev Tools Drawer
 *
 * @module controllers/DevTools
 */

var server = require('server');
var gtmHelpers = require('*/cartridge/scripts/gtm/gtmHelpers');
var serialize = require('../scripts/util/serialize');

/**
 * Fetch Data for Dev Drawer
 */
function GetData() {
    if (request.httpMethod !== 'GET') {
        return sendJSON({
            error: true,
            message: 'Method Not Allowed'
        }, 405);
    }

    const System = require('dw/system/System');
    const Response = require('dw/system/Response');

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, 'frame-ancestors \'self\'');
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, 'nosniff');

    const location = request.getGeolocation();

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        sendJSON({
            error: true,
            message: 'Not available on production instance!'
        }, 403);

        return;
    }

    // Get Basket Info
    var BasketMgr = require('dw/order/BasketMgr');
    var basket = BasketMgr.getCurrentBasket();

    // Get Preferences
    var Site = require('dw/system/Site');
    var currentSite = Site.getCurrent();
    var preferences = Site.getCurrent().getPreferences();

    // Send Content then Clear Logs
    sendJSON({
        basket: serialize(basket),
        geolocation: serialize(location),
        preferences: serialize(preferences),
        session: serialize(session),
        site: serialize(currentSite)
    })
}

/**
 * Helper to send a json response
 *
 * @param content
 * @param status
 */
function sendJSON(content, status) {
    response.setStatus(status || 200);
    response.setContentType('application/json');
    response.getWriter().print(JSON.stringify(content));
}

// render helpers for velocity template use from hooks
server.get('AfterFooter', server.middleware.include, function (req, res, next) {
    res.render('rvw/devtools/drawer', {
        id: gtmHelpers.gtmContainer
    });

    next();
});

module.exports = server.exports();
module.exports.GetData = GetData;
module.exports.GetData.public = true;
