const fs = require('fs');

class NodeLogService {
    constructor() {
        this.nodeBuffer = [];
        this.fd = null;
    }

    /**
     *
     *
     * @param {object} options
     * @param {string} options.logFilePath
     * @memberof NodeLogService
     */
    async start(options) {
        try {
            const logFilePath = (options && options.logFilePath) || './electron2node.log';
            console.log('NodeLogService#start. logFilePath:', logFilePath);
            fs.open(logFilePath, 'w', (err, fd) => {
                this.fd = fd;
            });
            setInterval(() => {
                let len = this.nodeBuffer.length;
                for (let i = 0; i < len; i++) {
                    const line = this.nodeBuffer.shift();
                    //console.log(line);
                    fs.write(this.fd, line, () => {});
                    //fs.write(this.fd, '\n', () => {});
                }
            }, 1000);
        } catch(err) {
            throw err;
        }
    }

    receiveLog(buffer) {
        this.nodeBuffer = [...this.nodeBuffer, ...buffer];
    }
}

module.exports = NodeLogService;