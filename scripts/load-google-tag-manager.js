function getCookie(name) {
    var b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
};

function getCookieConsent() {
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#ffffff",
                "text": "#252525",
    
            },
            "button": {
                "background": " #2bb3bb",
                "text": "#ffffff"
            }
        },
        "cookie": {
            "domain": "scottlogic.com"
        },
        "theme": "classic",
        "onStatusChange": function(){location.reload()},
        "position": "bottom-left",
        "type": "opt-in",
        "content": {
            "message": "This site uses cookies for analytics, to improve your experience and show content you might like.",
            "href": "https://www.scottlogic.com/cookies-policy/"
        }
    });
}


function loadGTM() {
    const cookieSatus = getCookie('cookieconsent_status');
    if (cookieSatus === 'allow') {        
        //--Google Tag Manager--//
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-MMXGQRL');
        //--End Google Tag Manager--//
    }
    else if (cookieSatus !== 'deny') {
        getCookieConsent();
    }
}

