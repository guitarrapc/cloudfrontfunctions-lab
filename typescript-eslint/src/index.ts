// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request | AWSCloudFrontFunction.Response {
    // Keep compute utilization under 60!
    const { request } = event
    const clientIP = event.viewer.ip
    const ips = clientIP.split(".")

    for (const ip of ips) {
        if (isOdd(Number(ip))) {
            request.headers[ip] = { value: "Odd" }
        } else {
            request.headers[ip] = { value: "Even" }
        }
    }

    return request
}

/**
 * Detect number is Odd
 * @param {number} input number to check
 * @return {boolean} true if number is odd
 **/
function isOdd(input: number): boolean {
    return input % 2 === 1
}
