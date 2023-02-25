import { BaseLogger } from "./RawonLogger";
export class DebugLogManager extends BaseLogger {
    logData(level, contextName, data) {
        if (!this.logEnabled) return;
        const messages = [
            `[${contextName}]`
        ];
        if (Array.isArray(data)) {
            for (const [key, value] of data){
                messages.push(`${key.trim() ? `${key}: ` : ""}${value}`);
            }
        } else {
            messages.push(data);
        }
        this.log([
            `${messages.join("\n")}\n`
        ], level);
    }
    constructor(logEnabled, dev = true){
        super(dev);
        this.logEnabled = logEnabled;
    }
}
