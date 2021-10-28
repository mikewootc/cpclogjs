class ElectronFileLogger {
    constructor() {
        this.buffer = [];
        setInterval(() => {
            console.log('check transfer');
            if (this.service && this.service.receiveLog && this.buffer && this.buffer.length > 0) {
                console.log('transfer');
                this.service.receiveLog(this.buffer);
                this.buffer = [];
            }
        }, 1000);
    }

    error(...args) {
        this.buffer.push(args.join(' ') + '\n');
    }
    warn(...args) {
        this.buffer.push(args.join(' ') + '\n');
    }
    info(...args) {
        this.buffer.push(args.join(' ') + '\n');
    }
    debug(...args) {
        this.buffer.push(args.join(' ') + '\n');
    }
    trace(...args) {
        this.buffer.push(args.join(' ') + '\n');
    }

    setService(service) {
        this.service = service;
    }
}

module.exports = ElectronFileLogger;