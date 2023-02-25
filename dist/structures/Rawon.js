import { importURLToString } from "../utils/functions/importURLToString";
import { DebugLogManager } from "../utils/structures/DebugLogManager";
import { JSONDataManager } from "../utils/structures/JSONDataManager";
import { CommandManager } from "../utils/structures/CommandManager";
import { ModerationLogs } from "../utils/structures/ModerationLogs";
import { EventsLoader } from "../utils/structures/EventsLoader";
import { ClientUtils } from "../utils/structures/ClientUtils";
import { RawonLogger } from "../utils/structures/RawonLogger";
import { soundcloud } from "../utils/handlers/SoundCloudUtil";
import { SpotifyUtil } from "../utils/handlers/SpotifyUtil";
import * as config from "../config";
import { Client } from "discord.js";
import { resolve } from "node:path";
import got from "got";
export class Rawon extends Client {
    constructor(opt){
        super(opt);
        this.startTimestamp = 0;
        this.config = config;
        this.commands = new CommandManager(this, resolve(importURLToString(import.meta.url), "..", "commands"));
        this.events = new EventsLoader(this, resolve(importURLToString(import.meta.url), "..", "events"));
        this.data = new JSONDataManager(resolve(process.cwd(), "data.json"));
        this.logger = new RawonLogger({
            prod: this.config.isProd
        });
        this.debugLog = new DebugLogManager(this.config.debugMode, this.config.isProd);
        this.modlogs = new ModerationLogs(this);
        this.spotify = new SpotifyUtil(this);
        this.utils = new ClientUtils(this);
        this.soundcloud = soundcloud;
        this.request = got.extend({
            hooks: {
                beforeError: [
                    (error)=>{
                        this.debugLog.logData("error", "GOT_REQUEST", [
                            [
                                "URL",
                                error.options.url?.toString() ?? "[???]"
                            ],
                            [
                                "Code",
                                error.code
                            ],
                            [
                                "Response",
                                error.response?.rawBody.toString("ascii") ?? "[???]"
                            ]
                        ]);
                        return error;
                    }
                ],
                beforeRequest: [
                    (options)=>{
                        this.debugLog.logData("info", "GOT_REQUEST", [
                            [
                                "URL",
                                options.url?.toString() ?? "[???]"
                            ],
                            [
                                "Method",
                                options.method
                            ],
                            [
                                "Encoding",
                                options.encoding ?? "UTF-8"
                            ],
                            [
                                "Agent",
                                options.agent.http ? "HTTP" : "HTTPS"
                            ]
                        ]);
                    }
                ]
            }
        });
        this.build = async ()=>{
            this.startTimestamp = Date.now();
            this.events.load();
            await this.login();
            return this;
        };
    }
}
