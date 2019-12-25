function globalURL(requestDetails) {
    document.cookie = "intl_locale=en_US;domain=.aliexpress.com;path=/ ";
    document.cookie = "intl_locale=en_US;domain=.aliexpress.ru;path=/ ";
    let requestUrl = requestDetails.url;
    if (requestUrl.startsWith("https://aliexpress.ru")) {
        let globalSite = requestUrl.replace("https://aliexpress.ru", "https://www.aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    } else if (requestUrl.startsWith("https://ru.aliexpress.com")) {
        let globalSite = requestUrl.replace("https://ru.aliexpress.com", "https://www.aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    } else if (requestUrl.startsWith("https://www.aliexpress.com/ru/")) {
        let globalSite = requestUrl.replace("https://www.aliexpress.com/ru/", "https://www.aliexpress.com/");
        return {
            redirectUrl: globalSite
        };
    } else if (requestUrl.startsWith("https://login.aliexpress.ru")) {
        let globalSite = requestUrl.replace(/\.aliexpress\.ru/g, ".aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    } else if (requestUrl.startsWith("https://trade.aliexpress.ru")) {
        let globalSite = requestUrl.replace("https://trade.aliexpress.ru", "https://trade.aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    }

}

function globalURLHeaders(requestDetails) {
    for (let header of requestDetails.requestHeaders) {
        if (header.name.toLowerCase() === "cookie") {
            header.value = header.value.replace(/locale\=ru\_RU/g, "locale=en_US").replace(/site\=rus/g, "site=glo");
        }
    }
    for (let header of requestDetails.requestHeaders) {
        if (header.name.toLowerCase() === "cookie") {
            console.log(header.value);
        }
    }
}

browser.webRequest.onBeforeRequest.addListener(
    globalURL, {
    urls: ["https://aliexpress.ru/*", "https://ru.aliexpress.com/*", "https://www.aliexpress.com/ru/*", "https://login.aliexpress.ru/*"]
}, ["blocking"]);

browser.webRequest.onBeforeSendHeaders.addListener(
    globalURLHeaders, {
    urls: ["https://aliexpress.ru/*", "https://ru.aliexpress.com/*", "https://www.aliexpress.com/ru/*", "https://login.aliexpress.ru/*"]
}, ["blocking", "requestHeaders"]);
