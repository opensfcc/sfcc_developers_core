"use strict";

/**
 * Display development console template
 */
function Show() {
    var ISML = require("dw/template/ISML");
    var Response = require("dw/system/Response");
    var System = require("dw/system/System");
    var URLUtils = require("dw/web/URLUtils");

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, "frame-ancestors 'self'");
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, "nosniff");

    if (!request.isHttpSecure()) {
        response.redirect(URLUtils.https("Console-Show"));
        return;
    }

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        response.redirect(URLUtils.https("Home-Show"));
        return;
    }

    ISML.renderTemplate("dev_console/index", {
        urlPath: URLUtils.https("").toString() + "/default",
        staticPath: URLUtils.staticURL("/").toString(),
    });
}

module.exports.Show = Show;
module.exports.Show.public = true;

/**
 * Run the script and return the response
 */
function Run() {
    var System = require("dw/system/System");
    var URLUtils = require("dw/web/URLUtils");

    response.setHttpHeader(Response.CONTENT_SECURITY_POLICY, "frame-ancestors 'self'");
    response.setHttpHeader(Response.X_CONTENT_TYPE_OPTIONS, "nosniff");

    if (!request.isHttpSecure()) {
        response.redirect(URLUtils.https("Console-Show"));
        return;
    }

    if (System.getInstanceType() === System.PRODUCTION_SYSTEM) {
        response.setStatus(403);
        response.setContentType("application/json");
        response.getWriter().print(
            JSON.stringify({
                error: true,
                message: "Not available on production instance!",
            })
        );
        return;
    }

    var code = request.getHttpParameterMap().get("code").getStringValue("");
    var maxDepth = request.getHttpParameterMap().get("maxDepth").getStringValue("");

    if (!code || !maxDepth) {
        response.setStatus(418);
        response.setContentType("application/json");
        response.getWriter().print(
            JSON.stringify({
                error: true,
                message: "I'm a teapot!",
            })
        );
        return;
    }

    var result = null;

    try {
        var myFunc = new Function("code", code)();
        result = myFunc();
    } catch (e) {
        result = e;
    }

    var serializer = require("../scripts/serializer");
    result = serializer.serialize(result, maxDepth);

    if (typeof result === "string" || typeof result === "boolean" || typeof result === "number") {
        response.setContentType("application/json");
        response.getWriter().print(JSON.stringify([result]));
        return;
    }

    response.setContentType("application/json");
    response.getWriter().print(JSON.stringify(result || {}));
}

module.exports.Run = Run;
module.exports.Run.public = true;
