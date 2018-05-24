var cookieBoxExample = {
	listIntro: new DOMParser().parseFromString(
		'<p>' +
			'<b>Welcome to this website!</b>' +
		'</p>' +
		'<p>' +
			'We use cookies to craft the best possible experience for you.<br/>' +
			'Please select which cookies you\'d like to allow us to save in your browser.' +
		'</p>'
	, 'text/html').firstChild,
	callbacks: {
		init: function() {
			return new Promise(function(resolve, reject) {
				return cookieBoxExample.showPopup(true)
					.then(resolve, reject);
			})
		}
	},
	groups: {
		basic: 'Basic behaviour',
		advanced: 'Advanced behaviour',
		custom: 'Customized behaviour'
	},
	showPopup: function(initial) {
		var form = document.createElement('cookieboxlist');

		var swalOptions = {
			title: '🍪 Cookie preferences',
			buttons: {
				danger: 'Cancel',
				save: 'Save'
			},
			content: form,
			closeOnClickOutside: !initial
		};

		if(initial) {
			delete swalOptions.buttons.danger;
		}

		return swal(swalOptions)
			.then(function(value) {
				switch(value) {
					case 'save': {
						form.dispatchEvent(new Event('submit'));
						return swal(
							'Saved', 'Your cookie preferences were saved!\n\nYou should now try to play around with' +
							' the cookies in your browser\'s developer tools by using the console or the cookie table.',
							'success'
						);
					}
					case 'danger': {
						break;
					}
				}
			})
		;
	},
	rollCookie: function() {
		document.querySelector('#cookieRoll').classList.add('show')
	}
}

CookieBoxOptions = {
	active: true,
	callbacks: {
		initialVisit: cookieBoxExample.callbacks.init,
		afterSetup: function() {
			setTimeout(function() {
				cookieBoxExample.rollCookie();
			}, 0);
		}
	},
	observability: {
		hide: false,
		throw: true,
		quiet: false,
		verbose: true
	},
	list: {
		intro: cookieBoxExample.listIntro,
		submit: {
			enabled: false,
			text: 'Okay',
			reload: false
		}
	},
	whitelist: {
		expiry: 365.25 * 24 * 60 * 60,
		path: '/',
		inheritAllowed: true,
		keepDenied: true
	},
	definitions: {
		allow: [
			'allow'
		],
		deny: {
			deny: {
				description: 'This cookie will be denied and either invoke an error message or throw an exeption.',
				group: cookieBoxExample.groups.basic,
				behaviour: 'deny'
			},
			drop: {
				description: 'This cookie will simply be dropped.',
				group: cookieBoxExample.groups.basic,
				behaviour: 'drop'
			},
			blank: {
				description: 'This cookie will be saved without content but exist in memory with its value.',
				group: cookieBoxExample.groups.advanced,
				behaviour: 'blank'
			},
			ghost: {
				description: 'This cookie will be set to memory but not get written to your disk.',
				group: cookieBoxExample.groups.advanced,
				behaviour: 'ghost'
			},
			custom: {
				description: 'This cookie has custom handling.',
				group: cookieBoxExample.groups.custom,
				behaviour: function(cookie) {
					console.log('Custom denial handler for cookie "' + cookie.name + '"!')
				}
			},
		}
	}
};

document.addEventListener('DOMContentLoaded', function() {
	document.querySelector('#cookieRoll').addEventListener('click', function() {
		cookieBoxExample.showPopup();
	});
});
