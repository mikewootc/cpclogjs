let bunyan = require('bunyan');
let loggerBunyan = bunyan.createLogger({
    name: 'test', 
    level: 'trace',
    streams: [{
        type: 'rotating-file',
        path: './by.log',
        period: '1d',   // daily rotation
        count: 30,      // keep 3 back copies
    }]
});
loggerBunyan.info("hi bunyan");
loggerBunyan.log = loggerBunyan.debug;


const Logger = require('../index.js');
const M1 = require('./M1.js');

//Logger.setLoggerInstance(loggerWinston);
Logger.setLoggerInstance(loggerBunyan);

//Logger.setEnv('node');
const logger = Logger.createWrapper('TestLog', Logger.LEVEL_TRACE);
const logger2 = Logger.createWrapper('TestLog2', Logger.LEVEL_TRACE);

function testLog() {
    logger.info('Test level =====================================================================');
    logger.error('This is a error');
    logger.warn('This is a warning');
    logger.info('This is a info');
    logger.debug('This is a debug');
    logger.trace('This is a trace');

    logger.info('Test color =====================================================================');
    let segments = ['string:', 'hello world', ', number:', 123, ', array:', [4, 5], ', obj:', {a: 1, b: 'hello'}];
    logger.info(Logger.RED         , '[RED      ]', ...segments);
    logger.info(Logger.RED_B       , '[RED_B    ]', ...segments);
    logger.info(Logger.GREEN       , '[GREEN    ]', ...segments);
    logger.info(Logger.GREEN_B     , '[GREEN_B  ]', ...segments);
    logger.info(Logger.YELLOW      , '[YELLOW   ]', ...segments);
    logger.info(Logger.YELLOW_B    , '[YELLOW_B ]', ...segments);
    logger.info(Logger.BLUE        , '[BLUE     ]', ...segments);
    logger.info(Logger.BLUE_B      , '[BLUE_B   ]', ...segments);
    logger.info(Logger.MAGENTA     , '[MAGENTA  ]', ...segments);
    logger.info(Logger.MAGENTA_B   , '[MAGENTA_B]', ...segments);
    logger.info(Logger.CYAN        , '[CYAN     ]', ...segments);
    logger.info(Logger.CYAN_B      , '[CYAN_B   ]', ...segments);
    logger.info('Multi color in one line:', Logger.RED_B, 'RED_B,', Logger.GREEN_B, 'GREEN_B,', Logger.BLUE_B, 'BLUE_B,', Logger.CLR, 'and no color');

    let m1 = new M1();
    m1.logIt();

}

testLog();

setTimeout(() => {
    logger.info('Test adjust level ==============================================================');
    logger.info('Should has just warn and error here:');
    Logger.adjustTag('TestLog', Logger.LEVEL_WARN);
    logger.error('This is a error');
    logger.warn('This is a warning');
    logger.info('This is a info');
    logger.debug('This is a debug');
    logger.trace('This is a trace');

    logger.info('Test adjust all level ==========================================================');
    logger.info('Should has just warn and error here:');
    Logger.adjustAllLevel(Logger.LEVEL_WARN);
    logger.error('This is a error');
    logger.warn('This is a warning');
    logger.info('This is a info');
    logger.debug('This is a debug');
    logger.trace('This is a trace');

    logger2.error('This is a error 2');
    logger2.warn('This is a warning 2');
    logger2.info('This is a info 2');
    logger2.debug('This is a debug 2');
    logger2.trace('This is a trace 2');
}, 2000);

