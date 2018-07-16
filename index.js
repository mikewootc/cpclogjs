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
        return new LogWrapper(tag, level);
    }

    static setLogger() {
        return new LogDummy();
    }

    static setEnv(e) {
        env = e;
    }

    constructor() {
        //super();
    }
}

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
        for (var i = 0; i < args.length; i++) {
            if (i == 0) {
                //format += '[' + this.MODULE_TAG + ' ' + getFunctionName() + ']';
                format += '[' + this.MODULE_TAG + ']';
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
                format += ' %O';
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
            if (typeof(it) == 'string' && it.indexOf('[') >= 0) {
                return this.transColor2Browser(it);
            } else {
                return it;
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
            console.log(fmt, ...segs);
        }
    }

    warn(...args) {
        if (this.level >= Logger.LEVEL_WARN) {
            //console.warn('[01;33m[' + this.MODULE_TAG + '] Warn:[0m', ...args);
            args = [Logger.YELLOW_B, ...args];
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            console.log(fmt, ...segs);
        }
    }

    info(...args) {
        if (this.level >= Logger.LEVEL_INFO) {
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            console.log(fmt, ...segs);
        }
    }

    debug(...args) {
        if (this.level >= Logger.LEVEL_DEBUG) {
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            console.log(fmt, ...segs);
        }
    }

    trace(...args) {
        if (this.level >= Logger.LEVEL_TRACE) {
            //console.log('\x1b[38;5;239m[' + this.MODULE_TAG + ']', ...args, '[0m');
            //console.log('%c[' + this.MODULE_TAG + ']%s', 'color: #888', ...args);
            args = [Logger.DARK, ...args];
            const fmt = this.getFormat(args);
            const segs = this.getSegments(args);
            console.log(fmt, ...segs);
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












module.exports = Logger;
//export default ;


// refs:
// https://www.w3schools.com/colors/colors_names.asp
