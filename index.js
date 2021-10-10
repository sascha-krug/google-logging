const express = require('express');
const {serializeError, deserializeError} = require('serialize-error');

const logger = console;
const app = express();

function logErrors(err, req, res, next) {
    console.error(loggerJson({req, res, severity: 'ERROR', operation: req.path, message: serializeError(err) }));
    res.status(500).send('error')
  }

app.get('/', (req, res, next) => {
    
    if (req.query.err) {
        next(new Error('test'));
    } else {   
    logger.info(loggerJson({req, res, message: 'passt', severity: 'INFO', operation: req.path}));
    res.send('Hello');
    }
})

app.use(logErrors);
app.listen(3000, () => {
    logger.info('Server running');
})

const loggerJson = ({message, req, res, severity, operation}) => ({
    severity: severity,
    message,
    httpRequest: {
        requestMethod: req.method,
        requestUrl: req.url,
        status: res.statusCode,
        userAgent: req.get('user-agent'),
        remoteIp: req.ip,
        referer: req.get('referer'),
        protocol: req.protocol,
    },
    path: req.path,
    time: (new Date()).toISOString(),
    'logging.googleapis.com/operation': {
        id: operation
    },

});
