(function() {
    document.addEventListener("click", function (e) {
        const link = e.target.closest('a');
        if (link && link.href && link.href.toLowerCase().startsWith('mailto:')) {
            e.preventDefault(); // Prevent a link from following the URL

            MailtoAnywhere.getSettings(function(settings) {
                const url = MailtoAnywhere.parseURL(settings.url, link.href);
                if (settings.openInNewWindow) {
                    window.open(url);
                } else {
                    window.location.href = url;
                }
            });
        }
    });
})();
