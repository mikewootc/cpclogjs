'use strict';

let env;
if (typeof window != 'undefined') {
    env = 'browser';
} else {
    env = 'node';
}

class Logger {
    static createDummy() {
        return new LogDummy();
    }

    static createWrapper(tag, level) {
        try {
            if (!tag) {
                throw new Error('NoTagError');
            }

            let logger;
            logger = new LogWrapper(tag, level);
            //if (Logger.WrapperName == 'winston') {
            //    logger = new 
            //} else {
            //    logger = new LogWrapper(tag, level);
            //}

            if (tag) {
                Logger.tagMap[tag] = logger;
            }
            return logger;
        } catch(err) {
            throw err;
        }
    }

    static adjustTag(tag, level) {
        if (!tag) {
            return; // Do not throw error, just no adjust.
        }

        if (!level || isNaN(level)) {
            return; // Do not throw error, just no adjust.
        }

        if (Logger.tagMap[tag]) {
            Logger.tagMap[tag].level = level;
        }
    }

    static adjustAllLevel(level) {
        if (!level || isNaN(level)) {
            return; // Do not throw error, just no adjust.
        }

        for (let tag in Logger.tagMap) {
            if (Logger.tagMap[tag]) {
                Logger.tagMap[tag].level = level;
            }
        }
    }

    static setLogger() {
        return new LogDummy();
    }

    static setLoggerInstance(ins) {
        Logger.loggerInstance = ins;
    }

    static setEnv(e) {
        env = e;
    }

    /**
     * config
     *
     * @static
     * @param {Object} config
     * @param {boolean} config.showDate
     * @param {boolean} config.objToJson object转化为json字符串
     * @param {boolean} config.noFormat 忽略格式字符, 避免不识别格式字符的平台上, 显示一堆'%s %s %O 等等'
     * @returns {undefined}
     */
    static setConfig(config) {
        Logger.config = config;
        //return new LogDummy();
    }

    constructor() {
        //super();
    }
}

Logger.tagMap = {};


class LogDummy {
    constructor() {
    }

    error(...args) {
    }

    warn(...args) {
    }

    info(...args) {
    }

    debug(...args) {
    }

    trace(...args) {
    }
}

function getFunctionName() {
    const s = (new Error()).stack;
    //console.log(s);
    const funcs = /at getFunctionName[^\n]*\n[^\n]*\n[^\n]*\n\s*at (\S+) *\(/.exec(s);
    //const lines = /at getFunctionName[^\n]*\n[^\n]*\n\s*at [^\n]*:(.+)/.exec(s);
    //console.log(funcs);
    //console.log(lines);
    let f = '----';
    let l = 0;
    if (funcs) {
        f = funcs[1];
    }
    //if (lines) {
    //    l = lines[1];
    //}

    return f;
}   

class LogWrapper {
    constructor(tag, level) {
        this.MODULE_TAG = tag;
        this.level = level ? level : Logger.LEVEL_INFO;
    }

    getFormat(args) {
        let format = '';
        if (Logger.config && Logger.config.showDate) {
            format += new Date().toLocaleString({weekday: "long", year: "numeric", month: "2-digit", day: "2-digit"}) + ' ';
        }

        for (var i = 0; i < args.length; i++) {
            if (i == 0) {
                //format += '[' + this.MODULE_TAG + ' ' + getFunctionName() + ']';
                format += '[' + this.MODULE_TAG + ']';
            }

            if (Logger.config && Logger.config.noFormat) {
                // 如果配置了noFormat, 则不添加后续的格式字符.
                return format;
            }

            if (typeof(args[i]) == 'string' && args[i].indexOf('[') >= 0) {
                if (env == 'browser') {
                    format += '%c';
                } else {
                    format += '%s';
                }
            } else if (typeof(args[i]) == 'string' || typeof(args[i]) == 'number') {
                format += ' %s';
            } else {
                if (Logger.config && Logger.config.objToJson && typeof args[i] == 'object') {
                    format += ' %s';
                } else {
                    format += ' %O';
                }
            }
        }

        if (env == 'node') {
            format += Logger.CLR;
        }

        return format;
    }

    transColor2Browser(color) {
        if (env == 'browser') {
            switch (color) {
                case Logger.RED       : return Logger.BR_RED      ;
                case Logger.RED_B     : return Logger.BR_RED_B    ;
                case Logger.GREEN     : return Logger.BR_GREEN    ;
                case Logger.GREEN_B   : return Logger.BR_GREEN_B  ;
                case Logger.YELLOW    : return Logger.BR_YELLOW   ;
                case Logger.YELLOW_B  : return Logger.BR_YELLOW_B ;
                case Logger.BLUE      : return Logger.BR_BLUE     ;
                case Logger.BLUE_B    : return Logger.BR_BLUE_B   ;
                case Logger.MAGENTA   : return Logger.BR_MAGENTA  ;
                case Logger.MAGENTA_B : return Logger.BR_MAGENTA_B;
                case Logger.CYAN      : return Logger.BR_CYAN     ;
                case Logger.CYAN_B    : return Logger.BR_CYAN_B   ;
                case Logger.DARK      : return Logger.BR_DARK     ;
                default               : return Logger.BR_CLR      ;
            }
        } else {
            return color;
        }
    }

    getSegments(args) {
        return args.map((it) => {
            if (typeof(it) == 'string' && it.indexOf('[') >= 0) {  // 颜色字符串
                return this.transColor2Browser(it);
            } else {
                if (Logger.config && Logger.config.objToJson && typeof it == 'object') {
                    let cache = [];
                    let strJson = JSON.stringify(it, function (key, value) {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.indexOf(value) !== -1) {
                                // 移除环形引用对象
                                return;
                            }
                            // 收集所有的值
                            cache.push(value);
                        }/* else if (typeof value === 'function') {
                            //return value.toString();
                            return 'Function';
                        }*/

                        return value;
                    });
                    cache = null;
                    return strJson;
                } else {
                    return it;
                }
            }
        });
    }

    error(...args) {
        if (this.level >= Logger.LEVEL_ERROR) {
            //const fmt = this.getFormat(args);
            //console.log('%c[' + this.MODULE_TAG + '] Error:' + fmt, 'color: #f00', ...args);

            args = [Logger.RED_B, ...args];
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            Logger.loggerInstance.error(fmt, ...segs);
        }
    }

    warn(...args) {
        if (this.level >= Logger.LEVEL_WARN) {
            //console.warn('[01;33m[' + this.MODULE_TAG + '] Warn:[0m', ...args);
            args = [Logger.YELLOW_B, ...args];
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            Logger.loggerInstance.warn(fmt, ...segs);
        }
    }

    info(...args) {
        if (this.level >= Logger.LEVEL_INFO) {
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            Logger.loggerInstance.info(fmt, ...segs);
        }
    }

    debug(...args) {
        if (this.level >= Logger.LEVEL_DEBUG) {
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            if (Logger.loggerInstance == console) {
                console.log(fmt, ...segs);
            } else {
                Logger.loggerInstance.debug(fmt, ...segs);
            }
        }
    }

    trace(...args) {
        if (this.level >= Logger.LEVEL_TRACE) {
            //console.log('\x1b[38;5;239m[' + this.MODULE_TAG + ']', ...args, '[0m');
            //console.log('%c[' + this.MODULE_TAG + ']%s', 'color: #888', ...args);
            args = [Logger.DARK, ...args];
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            //Logger.loggerInstance.debug(fmt, ...segs);
            if (Logger.loggerInstance == console) {
                console.log(fmt, ...segs);
            } else {
                Logger.loggerInstance.trace(fmt, ...segs);
            }
        }
    }
}

Logger.LEVEL_TRACE = 5;
Logger.LEVEL_DEBUG = 4;
Logger.LEVEL_INFO  = 3;
Logger.LEVEL_WARN  = 2;
Logger.LEVEL_ERROR = 1;
Logger.RED          = '[31m';
Logger.RED_B        = '[01;31m';
Logger.GREEN        = '[32m';
Logger.GREEN_B      = '[01;32m';
Logger.YELLOW       = '[33m';
Logger.YELLOW_B     = '[01;33m';
Logger.BLUE         = '[34m';
Logger.BLUE_B       = '[01;34m';
Logger.MAGENTA      = '[35m';
Logger.MAGENTA_B    = '[01;35m';
Logger.CYAN         = '[36m';
Logger.CYAN_B       = '[01;36m';
Logger.DARK         = '[02;37m';
Logger.CLR          = '[0m';

Logger.BR_RED       = 'color: red';
Logger.BR_RED_B     = 'color: red; font-weight:bold;';
Logger.BR_GREEN     = 'color: green';
Logger.BR_GREEN_B   = 'color: green; font-weight:bold;';
Logger.BR_YELLOW    = 'background: #ffa';
Logger.BR_YELLOW_B  = 'background: #ff0; font-weight:bold;';
Logger.BR_BLUE      = 'color: blue';
Logger.BR_BLUE_B    = 'color: blue; font-weight:bold;';
Logger.BR_MAGENTA   = 'color: magenta';
Logger.BR_MAGENTA_B = 'color: magenta; font-weight:bold;';
Logger.BR_CYAN      = 'color: #08f';
Logger.BR_CYAN_B    = 'color: #08f; font-weight:bold;';
Logger.BR_DARK      = 'color: #888';
Logger.BR_CLR       = '';






//Logger.WrapperName = 'default';
Logger.loggerInstance = console;


module.exports = Logger;
//export default ;


// refs:
// https://www.w3schools.com/colors/colors_names.asp
