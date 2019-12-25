var requiredUrls = ["*://aliexpress.ru/*", "*://aliexpress.com/*", "*://*.aliexpress.com/*", "*://*.aliexpress.ru/*"];
var domainRegexp = new RegExp('^http(s)?\:\/\/([a-z]+.)?aliexpress\.ru', 'i');
var subdomainRegexp = new RegExp('^http(s)?\:\/\/(ru.)?aliexpress\.com', 'i');
var pathRegexp = new RegExp('^http(s)?\:\/\/([a-z].)?aliexpress\.com\/ru\//', 'i');

function globalURL(requestDetails) {
    var requestUrl = requestDetails.url;
    if (domainRegexp.test(requestUrl)) {
        let globalSite = requestUrl.replace(/aliexpress\.ru/g, "aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    } else if (subdomainRegexp.test(requestUrl)) {
        let globalSite = requestUrl.replace("ru.aliexpress.com", "www.aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    } else if (pathRegexp.test(requestUrl)) {
        let globalSite = requestUrl.replace("aliexpress.com/ru/", "aliexpress.com/");
        return {
            redirectUrl: globalSite
        };
    }

}

function globalURLReqHeaders(reqDetails) {
    for (let header of reqDetails.requestHeaders) {
        if (header.name === "Cookie") {
            header.value = header.value.replace(/locale\=ru\_RU/g, "locale=en_US").replace(/site\=rus/g, "site=glo");
        }
    }
    return {
        requestHeaders: reqDetails.requestHeaders
    }
}

function globalURLRespHeaders(respDetails) {
    for (let header of respDetails.responseHeaders) {
        if (header.name == "set-cookie") {
            header.value = header.value.replace(/locale\=ru\_RU/g, "locale=en_US").replace(/site\=rus/g, "site=glo");
        }
    }
    return {
        responseHeaders: respDetails.responseHeaders
    }
}

browser.webRequest.onBeforeRequest.addListener(
    globalURL, {
    urls: requiredUrls
}, ["blocking", "requestBody"]);

browser.webRequest.onBeforeSendHeaders.addListener(
    globalURLReqHeaders, {
    urls: requiredUrls
}, ["blocking", "requestHeaders"]);

browser.webRequest.onHeadersReceived.addListener(
    globalURLRespHeaders, {
    urls: requiredUrls
}, ["blocking", "responseHeaders"]);
