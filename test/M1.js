const Logger = require('../index.js');

const logger = Logger.createWrapper('M1', Logger.LEVEL_TRACE);

class M1 {
    constructor() {
        //super();
    }

    logIt() {
        let segments = ['string:', 'hello world', ', number:', 123, ', array:', [4, 5], ', obj:', {a: 1, b: 'hello'}];
        logger.info(Logger.RED         , '[RED      ]', ...segments);
        logger.info(Logger.RED_B       , '[RED_B    ]', ...segments);

        logger.error('This is a error');
        logger.warn('This is a warning');
        logger.info('This is a info');
        logger.debug('This is a log');
        logger.trace('This is a trace');
    }
}

module.exports = M1;
