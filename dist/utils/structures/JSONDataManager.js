import { OperationManager } from "./OperationManager";
import { readFile, writeFile } from "fs/promises";
export class JSONDataManager {
    get data() {
        return this._data;
    }
    async save(data) {
        await this.manager.add(async ()=>{
            const dat = data();
            await writeFile(this.fileDir, JSON.stringify(dat));
            return undefined;
        });
        return this.load();
    }
    async load() {
        try {
            await this.manager.add(async ()=>{
                this._data = JSON.parse((await readFile(this.fileDir, "utf8")).toString());
                return undefined;
            });
            return this._data;
        } catch  {
            return this.data;
        }
    }
    constructor(fileDir){
        this.fileDir = fileDir;
        this.manager = new OperationManager();
        this._data = null;
        void this.load();
    }
}
