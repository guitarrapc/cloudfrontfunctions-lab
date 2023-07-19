function handler(event) {
    var request = event.request;
    var clientIP = event.viewer.ip;
    var ips = clientIP.split(".");
    for (var _i = 0, ips_1 = ips; _i < ips_1.length; _i++) {
        var ip = ips_1[_i];
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
