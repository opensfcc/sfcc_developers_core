'use strict';

/**
 * Display development console template
 */
function Show() {
    const ISML = require('dw/template/ISML');
    const Response = require('dw/system/Response');
    const System = require('dw/system/System');
    const URLUtils = require('dw/web/URLUtils');

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, 'frame-ancestors \'self\'');
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, 'nosniff');

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
 * Run the script and return the response
 */
function Run() {
    if (request.httpMethod !== 'POST') {
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

    const code = request.getHttpParameterMap().get('code').getStringValue('');
    const maxDepth = request.getHttpParameterMap().get('maxDepth').getIntValue(3);

    // if missing max depth or code return and do nothing, send no response
    if (!code || !maxDepth) {
        return;
    }

    let result;
    const startTime = new Date();

    try {
        const myFunc = new Function('code', code);
        result = myFunc();
    } catch (e) {
        result = e;
    }

    const runtime = new Date().getTime() - startTime.getTime();

    const serializer = require('../scripts/serializer');
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
