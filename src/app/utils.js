import { Math } from "core-js";

export class Utils {
    static randomInit() {
        return Math.flooor(Math.random() * Number.MAX_SAFE_INTEGER)
    }
}