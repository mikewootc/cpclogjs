

//import Logger from './Logger.js'
const Logger = require('../index.js');
const M1 = require('./M1.js');

//Logger.setEnv('node');
const logger = Logger.createWrapper('TestLog', Logger.LEVEL_TRACE);

function testLog() {
    console.log('Test level =====================================================================');
    logger.error('This is a error');
    logger.warn('This is a warning');
    logger.info('This is a info');
    logger.debug('This is a debug');
    logger.trace('This is a trace');

    console.log('Test color =====================================================================');
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

console.log('Test adjust level ==============================================================');
console.log('Should has just warn and error here:');
Logger.adjustTag('TestLog', Logger.LEVEL_WARN);
logger.error('This is a error');
logger.warn('This is a warning');
logger.info('This is a info');
logger.debug('This is a debug');
logger.trace('This is a trace');
