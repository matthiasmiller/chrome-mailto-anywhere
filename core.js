const MailtoAnywhere = (function() {
    const GOOGLE_DEFAULT = 'https://mail.google.com/mail/?extsrc=mailto&url={URL}';
    const PRESETS = {
        'Google (Default Account)': GOOGLE_DEFAULT,
        'Google (Account #1)': 'https://mail.google.com/mail/u/0/?extsrc=mailto&url={URL}',
        'Google (Account #2)': 'https://mail.google.com/mail/u/1/?extsrc=mailto&url={URL}',
        'Google (Account #3)': 'https://mail.google.com/mail/u/2/?extsrc=mailto&url={URL}',
        'Google (Account #4)': 'https://mail.google.com/mail/u/3/?extsrc=mailto&url={URL}',
        'Google (Account #5)': 'https://mail.google.com/mail/u/4/?extsrc=mailto&url={URL}',
        'AOL': 'http://webmail.aol.com/Mail/ComposeMessage.aspx?{ARGS}',
        'Yahoo! Mail': 'http://compose.mail.yahoo.com/?{ARGS}',
        'Outlook': 'https://outlook.office.com/mail/deeplink/compose/?mailtouri={URL}'
    }

    return {
        getPresets: function() {
            return PRESETS;
        },

        getSettings: function (callback) {
            chrome.storage.sync.get({
                url: GOOGLE_DEFAULT,
                openInNewWindow: true
            }, function (items) {
                callback({
                    url: items.url,
                    openInNewWindow: items.openInNewWindow
                });
            });
        },

        setSettings: function (settings, callback) {
            chrome.storage.sync.set(settings, function() {
                if (callback) callback();
            });
        },

        parseURL: function (template, mailto) {
            const url = new URL(mailto);

            const dest = template.replace(/{([^}]*)}/g, function (match) {
                // Trim the curly braces.
                const keyword = match.slice(1, -1).toLowerCase();

                // Handle special keywords
                if (keyword === 'url')
                    return encodeURIComponent(mailto);
                if (keyword === 'args') {
                    let parts = [];
                    if (url.pathname.length) {
                        parts.push('to=' + encodeURIComponent(url.pathname));
                    }
                    if (url.search.length > 1) {
                        parts.push(url.search.slice(1)); //remove ?
                    }
                    return parts.join('&');
                }
                if (keyword === 'to')
                    return encodeURIComponent(url.pathname);

                // Pull the rest from the mailto query string.
                return encodeURIComponent(url.searchParams.get(keyword) || '');
            });
            return dest;
        }
    }
})();
