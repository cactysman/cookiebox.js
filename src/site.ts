import { CookieBox } from './lib/cookieBox'

window['CookieBoxSettings'] = {
	observability: {
		hide: false,
		throw: true,
		quiet: false
	},
	list: {
		intro: 'Welcome'
	},
	definitions: {
		other: {
			name: 'General',
			cookies: {
				deny: {
					description: 'deny',
					behaviour: 'deny'
				},
				drop: {
					description: 'drop',
					behaviour: 'drop'
				},
				blank: {
					description: 'blank',
					behaviour: 'blank'
				},
				ghost: {
					description: 'ghost',
					behaviour: 'ghost'
				},
			}
		}
	}
}
