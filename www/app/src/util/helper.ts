import { APP_NAME } from "./settings";

export const setTitle = (name?: string) => {
    if (APP_NAME && APP_NAME !== "") {
        document.title = String(APP_NAME) + (name ? (" - " + name) : "");
    } else {
        document.title = name ? name : "";
    }
}