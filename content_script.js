(function() {
    document.addEventListener("click", function (e) {
        if (e.target.tagName === 'A' &&
            e.target.href.toLowerCase().startsWith('mailto:')) {

            e.preventDefault(); // Prevent a link from following the URL

            MailtoAnywhere.getSettings(function(settings) {
                const url = MailtoAnywhere.parseURL(settings.url, e.target.href);
                if (settings.openInNewWindow) {
                    window.open(url);
                } else {
                    window.location.href = url;
                }
            });
        }
    });
})();
