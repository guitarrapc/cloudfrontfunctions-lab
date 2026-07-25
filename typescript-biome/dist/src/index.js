"use strict";
function handler(event) {
    const { request } = event;
    const clientIP = event.viewer.ip;
    const ips = clientIP.split(".");
    for (const ip of ips) {
        if (isOdd(Number(ip))) {
            request.headers[ip] = { value: "Odd" };
        }
        else {
            request.headers[ip] = { value: "Even" };
        }
    }
    return request;
}
function isOdd(input) {
    return input % 2 === 1;
}
