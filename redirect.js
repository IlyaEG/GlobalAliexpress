const requiredUrls = ["*://aliexpress.ru/*", "*://aliexpress.com/*", "*://*.aliexpress.com/*", "*://*.aliexpress.ru/*"];
const blockedUrls = ["*://*.mmstat.com/*", "*://mmstat.com/*"];

function globalURLReqHeaders(reqDetails) {
    for (let header of reqDetails.requestHeaders) {
        if (header.name === "Cookie") {
            header.value = header.value.replace(/locale\=ru\_RU/g, "locale=en_US").replace(/site\=rus/g, "site=glo");
        }
    }
    return {
        requestHeaders: reqDetails.requestHeaders
    };
}

function globalURLRespHeaders(respDetails) {
    for (let header of respDetails.responseHeaders) {
        if (header.name == "set-cookie") {
            header.value = header.value.replace(/locale\=ru\_RU/g, "locale=en_US").replace(/site\=rus/g, "site=glo");
        }
    }
    return {
        responseHeaders: respDetails.responseHeaders
    };
}

function blockURL(requestDetails) {
    return {
        cancel: true
    };
}

browser.webRequest.onBeforeRequest.addListener(
    blockURL, {
    urls: blockedUrls
}, ["blocking", "requestBody"]);

browser.webRequest.onBeforeSendHeaders.addListener(
    globalURLReqHeaders, {
    urls: requiredUrls
}, ["blocking", "requestHeaders"]);

browser.webRequest.onHeadersReceived.addListener(
    globalURLRespHeaders, {
    urls: requiredUrls
}, ["blocking", "responseHeaders"]);
