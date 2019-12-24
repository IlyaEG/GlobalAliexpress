function globalURL(requestDetails) {
    document.cookie = "intl_locale=en_US;domain=.aliexpress.com;path=/ ";
    let requestedUrl = requestDetails.url;
    if (requestedUrl.startsWith("https://aliexpress.ru")) {
        let globalSite = requestedUrl.replace("https://aliexpress.ru", "https://www.aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    } else if (requestedUrl.startsWith("https://ru.aliexpress.com")) {
        let globalSite = requestedUrl.replace("https://ru.aliexpress.com", "https://www.aliexpress.com");
        return {
            redirectUrl: globalSite
        };
    }

}

browser.webRequest.onBeforeRequest.addListener(
    globalURL, {urls: ["https://aliexpress.ru/*", "https://ru.aliexpress.com/*"]}, ["blocking"]
);
