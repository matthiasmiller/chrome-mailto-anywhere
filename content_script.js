(function() {
    document.addEventListener("click", function (e) {
        if (e.target.tagName === 'A' &&
            e.target.href.toLowerCase().startsWith('mailto:')) {

            e.preventDefault(); // Prevent a link from following the URL

            MailtoAnywhere.getTemplate(function(urlTemplate) {
                const url = MailtoAnywhere.parseURL(urlTemplate, e.target.href);
                MailtoAnywhere.getOpenInNewWindow(function(openInNewWindow) {
                    if (openInNewWindow) {
                        window.open(url);
                    } else {
                        window.location.href = url;
                    }
                });
            });
        }
    });
})();
