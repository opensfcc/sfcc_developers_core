'use strict';

var SecurityHelpers = require('*/cartridge/scripts/helpers/securityHelpers');

/**
 * Display development console template
 */
function Show() {
    const ISML = require('dw/template/ISML');
    const System = require('dw/system/System');
    const URLUtils = require('dw/web/URLUtils');

    SecurityHelpers.addSecurityHeaders();

    if (!request.isHttpSecure()) {
        response.redirect(URLUtils.https('Console-Show').toString());
        return;
    }

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        response.redirect(URLUtils.https('Home-Show').toString());
        return;
    }

    ISML.renderTemplate('dev_console/index', {
        urlPath: URLUtils.https('Console-Run').toString(),
        staticPath: URLUtils.staticURL('/').toString(),
    });
}

module.exports.Show = Show;
module.exports.Show.public = true;

/**
 * Display development console template in the storefront
 */
function ShowStorefront() {
    var Site = require('dw/system/Site');
    var URLUtils = require('dw/web/URLUtils');
    var URLAction = require('dw/web/URLAction');

    var currentSite = Site.getCurrent();

    var storefrontAction = new URLAction('Console-Show', currentSite.getID());

    response.redirect(URLUtils.abs(storefrontAction));
}

module.exports.ShowStorefront = ShowStorefront;
module.exports.ShowStorefront.public = true;

/**
 * Run the script and return the response
 */
function Run() {
    if (request.httpMethod !== 'POST') {
        return sendJSON({
            error: true,
            message: 'Method Not Allowed'
        }, 405);
    }

    var System = require('dw/system/System');

    SecurityHelpers.addSecurityHeaders();

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        sendJSON({
            error: true,
            message: 'Not available on production instance!'
        }, 403);

        return;
    }

    var code = request.getHttpParameterMap().get('code').getStringValue('');
    var maxDepth = request.getHttpParameterMap().get('maxDepth').getIntValue(3);

    // if missing max depth or code return and do nothing, send no response
    if (!code || !maxDepth) {
        return;
    }

    var result;
    var startTime = new Date();

    try {
        var myFunc = new Function('code', code);
        result = myFunc();
    } catch (e) {
        result = e;
    }

    var runtime = new Date().getTime() - startTime.getTime();

    var serializer = require('../scripts/serializer');
    result = serializer.serialize(result, maxDepth);

    if (typeof result === 'string' || typeof result === 'boolean' || typeof result === 'number') {
        return sendJSON({result: [result], executionTime: runtime});
    }

    sendJSON({result: result || {}, executionTime: runtime});
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

module.exports.Run = Run;
module.exports.Run.public = true;
