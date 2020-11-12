'use strict';

const server = require('server');
const URLUtils = require('dw/web/URLUtils');

const serializer = require('../scripts/serializer');

/**
 * Display development console template
 */
server.get(
    'Show',
    server.middleware.https,
    function (req, res, next) {
        if (dw.system.System.instanceType === dw.system.System.PRODUCTION_SYSTEM) {
            res.redirect(URLUtils.https('Home-Show').toString());

            return next();
        }

        res.render('dev_console/index', {
            urlPath: URLUtils.https('').toString() + '/default',
            staticPath: URLUtils.staticURL('/').toString()
        });

        return next();
    }
);

/**
 * Run the script and return the response
 */
server.post(
    'Run',
    server.middleware.https,
    function (req, res, next) {
        if (dw.system.System.instanceType === dw.system.System.PRODUCTION_SYSTEM) {
            res.setStatusCode(403);
            res.json({
                error: true,
                message: 'Only available in SIG environments'
            });

            return next();
        }

        const code = req.form.code;
        const maxDepth = req.form.maxDepth;

        if (!code || !maxDepth) {
            return false;
        }

        let result = null;
        const startTime = new Date();

        try {
            const myFunc = new Function('code', code);
            result = myFunc();
        } catch (e) {
            result = e;
        }

        const runtime = new Date().getTime() - startTime.getTime();

        result = serializer.serialize(result, maxDepth);

        if (typeof result === 'string' || typeof result === 'boolean' || typeof result === 'number') {
            res.json({
                executionTime: runtime,
                result: [result]
            });
        } else {
            res.json({
                executionTime: runtime,
                result: result || {}
            });
        }

        next();
    }
);

module.exports = server.exports();
