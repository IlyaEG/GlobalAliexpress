const requiredUrls = ["*://aliexpress.ru/*", "*://aliexpress.com/*", "*://*.aliexpress.com/*", "*://*.aliexpress.ru/*"];
const blockedUrls = ["*://*.mmstat.com/*", "*://mmstat.com/*"];
// Currently it seems to be impossible to redirect store pages :(
const storeRegexp = new RegExp('^http(s)?\:\/\/([a-z0-9]+.)?aliexpress\.ru\/store', 'i');

const domainRegexp = new RegExp('^http(s)?\:\/\/([a-z0-9]+.)?aliexpress\.ru', 'i');
const subdomainRegexp = new RegExp('^http(s)?\:\/\/ru\.aliexpress\.com', 'i');
const pathRegexp = new RegExp('^http(s)?\:\/\/([a-z].)?aliexpress\.com\/ru\//', 'i');
const mmstatRegexp = new RegExp('^http(s)?\:\/\/([a-z].)?mmstat\.com\//', 'i');

function globalURL(requestDetails) {
    var requestUrl = requestDetails.url;
    if (storeRegexp.test(requestUrl)) {
        return;
    } else if (domainRegexp.test(requestUrl)) {
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
            header.value = header.value.replace(/locale\=ru\_RU/g, "locale=en_US").replace(/site\=rus/g, "site=glo");//.replace(/region\=RU/g, "region=US");
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
        } else if (header.name == "location" && !storeRegexp.test(header.value)) {
            header.value = header.value.replace(/aliexpress\.ru/g, "aliexpress.com");
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
