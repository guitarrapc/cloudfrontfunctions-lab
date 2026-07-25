"use strict";
function handler(event) {
    const { request } = event;
    const olduri = request.uri;
    const newuri = olduri.replace(/\/\?/, "/index.html?");
    request.uri = newuri;
    return request;
}
