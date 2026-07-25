"use strict";
function handler(event) {
    const { request } = event;
    const uri = request.uri;
    const targetPath = "bar.png";
    const rewritePath = "bar-ip.png";
    if (uri.endsWith(`/${targetPath}`)) {
        const clientIP = event.viewer.ip;
        const allow_ip_list = ["1.1.1.1", "1.1.4.4", "8.8.8.8"];
        const isAllowIP = isIpInCidr(clientIP, allow_ip_list);
        if (isAllowIP) {
            const newurl = uri.replace(`/${targetPath}`, `/${rewritePath}`);
            request.headers["true-client-ip"] = { value: clientIP };
            request.uri = newurl;
            return request;
        }
    }
    return request;
}
function isIpInCidr(ipAddress, cidrs) {
    const ip = getIpRange(ipAddress);
    for (var i = 0; i < cidrs.length; i++) {
        const range = getIpRange(cidrs[i]);
        if (ip.min >= range.min && ip.max <= range.max) {
            return true;
        }
    }
    return false;
}
function convertToBitString(array) {
    var ret = "";
    for (var i = 0; i < 4; i++) {
        const bit = "00000000" + parseInt(array[i], 10).toString(2);
        ret += bit.slice(-8);
    }
    return ret;
}
function convertToIpString(input) {
    var ret = "";
    ret = parseInt(input.slice(0, 8), 2) + ".";
    ret += parseInt(input.slice(8, 16), 2) + ".";
    ret += parseInt(input.slice(16, 24), 2) + ".";
    ret += parseInt(input.slice(24, 32), 2);
    return ret;
}
function getIpRange(ipAddress) {
    const ip = ipAddress.split("/");
    const group = ip[0].split(".");
    var ipBit = "";
    var minIpBit = "";
    var maxIpBit = "";
    if (!Array.isArray(ip) || group.length !== 4 || (ip.length === 2 && String(ip[1]).match(/^([1-9]|[1-2][0-9]|3[0-2])$/) === null)) {
        return { min: "", max: "" };
    }
    minIpBit = convertToBitString(group);
    if (ip.length === 1) {
        return { min: minIpBit, max: minIpBit };
    }
    for (var i = 0; i < 4; i++) {
        const bit = parseInt(group[i], 10).toString(2);
        if (Number(ip[1]) >= (i + 1) * 8) {
            ipBit += ("00000000" + bit).slice(-8);
        }
        else {
            const tmpIpBit = ("00000000" + bit).slice(-8);
            ipBit += (tmpIpBit.slice(0, Number(ip[1]) - i * 8) + "11111111").slice(0, 8);
            break;
        }
    }
    maxIpBit = (ipBit + "11111111111111111111111111111111").slice(0, 32);
    return { min: minIpBit, max: maxIpBit };
}
