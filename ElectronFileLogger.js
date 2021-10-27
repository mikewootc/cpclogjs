class ElectronFileLogger {
    constructor() {
        this.buffer = [];
        setInterval(() => {
            console.log('check transfer');
            if (this.service && this.service.receiveLog) {
                console.log('transfer');
                this.service.receiveLog(this.buffer);
                this.buffer = [];
            }
        }, 1000);
    }

    error(...args) {
        this.buffer.push(args.join(' '));
    }
    warn(...args) {
        this.buffer.push(args.join(' '));
    }
    info(...args) {
        this.buffer.push(args.join(' '));
    }
    debug(...args) {
        this.buffer.push(args.join(' '));
    }
    trace(...args) {
        this.buffer.push(args.join(' '));
    }

    setService(service) {
        this.service = service;
    }
}

module.exports = ElectronFileLogger;