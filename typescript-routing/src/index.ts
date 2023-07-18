/**
* tl;dr;
* CloudFront request based on IP Address
*
*  Mock event
// This event will rewrite request.uri to "/foo/bar_ip.png".
const event = {
  "version": "1.0",
  "context": {
    "distributionDomainName": "d111111abcdef8.cloudfront.net",
    "distributionId": "EDFDVBD6EXAMPLE",
    "eventType": "viewer-response",
    "requestId": "EXAMPLEntjQpEXAMPLE_SG5Z-EXAMPLEPmPfEXAMPLEu3EqEXAMPLE=="
  },
  "viewer": {
    "ip": "1.1.1.1"
  },
  "request": {
    "method": "GET",
    "uri": "/foo/bar.png",
    "querystring": {},
    "headers": {}
  }
};
**/
function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request {
  // Keep compute utilization under 60!
  const { request } = event
  const uri = request.uri
  const targetPath = "bar.png"
  const rewritePath = "bar-ip.png"

  // Check whether the URI is maintenance-status.json
  if (uri.endsWith(`/${targetPath}`)) {
    // Check whether client ip is internal access
    const clientIP = event.viewer.ip
    const allow_ip_list = ["1.1.1.1", "1.1.4.4", "8.8.8.8"]
    const isAllowIP = isIpInCidr(clientIP, allow_ip_list)
    if (isAllowIP) {
      // Force replace request URL to always not maintenance json.
      const newurl = uri.replace(`/${targetPath}`, `/${rewritePath}`)
      request.headers["true-client-ip"] = { value: clientIP }
      request.uri = newurl
      return request
    }
  }
  return request
}

/**
 * Detect IpAddress is in cidr or not
 * @param {string} ipAddress The IP string to check. 192.168.0.1
 * @param {Array} cidrs The array of CIDR. [192.168.0.0/24]
 * @return {Boolean} If IP string is in CIDR true, elase false.
 **/
function isIpInCidr(ipAddress: string, cidrs: Array<string>): boolean {
  const ip = getIpRange(ipAddress)
  for (var i = 0; i < cidrs.length; i++) {
    const range = getIpRange(cidrs[i])
    if (ip.min >= range.min && ip.max <= range.max) {
      return true
    }
  }
  return false
}

/**
 * Convert IP string to Bit string
 * @param {Array} array The array of IP string without subnet. ['127', '0', '0', '0']
 * @return {string} The bit string converted. 01111111000000000000000000000000
 **/
function convertToBitString(array: Array<string>): string {
  var ret = ""
  for (var i = 0; i < 4; i++) {
    const bit = "00000000" + parseInt(array[i], 10).toString(2)
    ret += bit.slice(-8)
  }
  return ret
}

/**
 * Convert Bit string to IP string
 * @param {string} input The bit string input to convert. 01111111000000000000000000000000
 * @return {string} The ip string converted. 127.0.0.1
 **/
function convertToIpString(input: string): string {
  var ret = ""
  ret = parseInt(input.slice(0, 8), 2) + "."
  ret += parseInt(input.slice(8, 16), 2) + "."
  ret += parseInt(input.slice(16, 24), 2) + "."
  ret += parseInt(input.slice(24, 32), 2)
  return ret
}

/**
 * Get min,max of IP Range
 * @param {string} ipAddress The IP String to detect range. You can use both CIDR and non-CIDR. 192.168.0.0/24 or 127.0.0.1
 * @return {Object} The range of the Bit string represent min, max. {min:11000000101010000000000000000000, max:11000000101010000000000011111111}
 **/
function getIpRange(ipAddress: string): { min: string; max: string } {
  const ip = ipAddress.split("/")
  const group = ip[0].split(".")
  var ipBit = ""
  var minIpBit = ""
  var maxIpBit = ""

  if (
    !Array.isArray(ip) ||
    group.length !== 4 ||
    (ip.length === 2 && String(ip[1]).match(/^([1-9]|[1-2][0-9]|3[0-2])$/) === null)
  ) {
    return { min: "", max: "" } // empty
  }

  minIpBit = convertToBitString(group)

  // no cidr input
  if (ip.length === 1) {
    return { min: minIpBit, max: minIpBit }
  }

  // with cidr input
  for (var i = 0; i < 4; i++) {
    const bit = parseInt(group[i], 10).toString(2)
    if (Number(ip[1]) >= (i + 1) * 8) {
      ipBit += ("00000000" + bit).slice(-8)
    } else {
      const tmpIpBit = ("00000000" + bit).slice(-8)
      ipBit += (tmpIpBit.slice(0, Number(ip[1]) - i * 8) + "11111111").slice(0, 8)
      break
    }
  }
  maxIpBit = (ipBit + "11111111111111111111111111111111").slice(0, 32)

  return { min: minIpBit, max: maxIpBit }
}
