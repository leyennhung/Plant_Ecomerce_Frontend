import axios from "axios";

export const api = axios.create({
    baseURL: "/plant",
    headers: {
        "Content-Type": "application/json"
    }
});
