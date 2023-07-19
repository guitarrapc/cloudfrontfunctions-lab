function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request | AWSCloudFrontFunction.Response {
    const { request } = event
    const uri = request.uri

    // Check whether the URI is missing a file name.
    if (uri.endsWith("/")) {
        request.uri += "index.html"
        // Check whether the URI is missing a file extension.
    } else if (!uri.includes(".")) {
        request.uri += "/index.html"
    }

    return request
}
