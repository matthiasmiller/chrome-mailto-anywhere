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

        getTemplate: function (callback) {
            chrome.storage.sync.get({
                url: GOOGLE_DEFAULT
            }, function (items) {
                callback(items.url);
            });
        },

        setTemplate: function (template, callback) {
            chrome.storage.sync.set({
                url: template
            }, function() {
                callback();
            });
        },

        getOpenInNewWindow: function (callback) {
            chrome.storage.sync.get({
                openInNewWindow: true
            }, function (items) {
                callback(items.openInNewWindow);
            });
        },

        setOpenInNewWindow: function (openInNewWindow, callback) {
            chrome.storage.sync.set({
                openInNewWindow: openInNewWindow
            }, function() {
                callback();
            });
        },

        parseURL: function (template, mailto) {
            const url = new URL(mailto);

            const dest = template.replace(/{([^}]*)}/g, function (keyword) {
                // Trim the curly braces.
                var keyword = keyword.substr(1, keyword.length - 2).toLowerCase();

                // Handle special keywords
                if (keyword == 'url')
                    return encodeURIComponent(mailto);
                if (keyword == 'args') {
                    let parts = [];
                    if (url.pathname.length) {
                        parts.push('to=' + encodeURIComponent(url.pathname));
                    }
                    if (url.search.length > 1) {
                        parts.push(url.search.substr(1)); //remove ?
                    }
                    return parts.join('&');
                }
                if (keyword == 'to')
                    return encodeURIComponent(url.pathname);

                // Pull the rest from the mailto query string.
                return encodeURIComponent(url.searchParams.get(keyword) || '');
            });
            return dest;
        }
    }
})();
