function handler(event) {
    var response = {
        statusCode: 302,
        statusDescription: "Found",
        headers: {
            "cloudfront-functions": { value: "generated-by-CloudFront-Functions" },
            location: { value: "https://aws.amazon.com/cloudfront/" },
        },
    }
    return response
}
