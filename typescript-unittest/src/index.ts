function handler(event: AWSCloudFrontFunction.Event): AWSCloudFrontFunction.Request | AWSCloudFrontFunction.Response {
    const { request } = event

    // Extract the request from the CloudFront event
    const olduri = request.uri;

    // Match any '/?' that occurs and replace with 'index.html?'
    const newuri = olduri.replace(/\/\?/, '\/index.html?');

    // Replace the received URI with the new URI
    request.uri = newuri;

    return request
  }
