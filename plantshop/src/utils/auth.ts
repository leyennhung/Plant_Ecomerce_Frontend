// Lấy user đang login từ localStorage
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user") || "null");
}
// Tạo ID cho khách chưa login
export function getSessionId() {
    let sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("session_id", sessionId);
    }

    return sessionId;
}
