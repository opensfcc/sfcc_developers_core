'use strict';

/**
 * Controller to handle the response from Afterpay
 *
 * @module controllers/DevTools
 */

var DevTools = require('../scripts/util/devtools');
var serialize = require('../scripts/util/serialize');

/**
 * Display development console template
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

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        sendJSON({
            error: true,
            message: 'Not available on production instance!'
        }, 403);

        return;
    }

    // // Get Basket Info
    // var BasketMgr = require('dw/order/BasketMgr');
    // var basket = BasketMgr.getCurrentBasket();

    // // Get Preferences
    // var Site = require('dw/system/Site');
    // var currentSite = Site.getCurrent();
    // var preferences = Site.getCurrent().getPreferences();

    // var content = {
    //     Debugger: session.custom.RVW_Debugger, // Clone Debugger
    //     basket: serialize(basket),
    //     preferences: serialize(preferences),
    //     session: serialize(session),
    //     site: serialize(currentSite)
    // }

    // Send Content then Clear Logs
    DevTools.prune();
    sendJSON(DevTools.getDebugger());
    //DevTools.clear();

    // if (request.requestID !== session.custom.RVW_Debugger.requestID) {
    //     DevTools.clear();
    // } else {
    //     session.custom.RVW_Debugger.lastRequestURL = request.httpURL.toString();
    //     session.custom.RVW_Debugger.requestID = request.requestID.toString();
    // }
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

module.exports.GetData = GetData;
module.exports.GetData.public = true;
