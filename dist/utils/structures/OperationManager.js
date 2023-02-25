export class OperationManager {
    get runningOperation() {
        return this._runningOperation;
    }
    add(operation) {
        return new Promise((resolve, reject)=>{
            this.operations.push([
                resolve,
                reject,
                operation
            ]);
            if (!this._runningOperation) {
                void this.runOperations();
            }
        });
    }
    async runOperations() {
        const operation = this.operations.shift();
        if (operation) {
            this._runningOperation = true;
            try {
                await operation[2]();
                operation[0]();
            } catch (err) {
                operation[1](err);
            } finally{
                void this.runOperations();
            }
        } else {
            this._runningOperation = false;
        }
    }
    constructor(){
        this.operations = [];
        Object.defineProperty(this, "_runningOperation", {
            configurable: false,
            enumerable: false,
            value: false,
            writable: true
        });
    }
}
