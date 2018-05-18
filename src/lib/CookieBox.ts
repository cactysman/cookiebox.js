export { Bootstrapper } from './module/Bootstrapper'
import { Interceptor } from './class/Interceptor'
import ICookieBoxOptions from './interface/ICookieBoxOptions'


export namespace CookieBox {
	export const
		dev: boolean = true,
		names = {
			settingsObject: 'CookieBoxOptions',
			whitelistCookie: '__cookieBoxWhitelist',
			anchorClassName: 'cookie-box--list',
			formClassName: 'cookie-box--form',
			createElement: 'cookieboxlist',
			denialDefault: '__cookieBoxDefault__'
		},
		optionsDefault: ICookieBoxOptions = {
			active: true,
			callbacks: {
				initialVisit: () => new Promise((resolve: () => any) => resolve()),
				afterSetup: () => {}
			},
			observability: {
				hide: false,
				throw: false,
				quiet: false,
				verbose: false
			},
			list: {
				intro: 'Please set up your preferences regarding cookies on this website.',
				submit: {
					text: 'I agree',
					reload: false
				}
			},
			whitelist: {
				expiry: 365.25 * 24 * 60 * 60,
				path: '/',
				inheritAllowed: false,
				keepDenied: false
			},
			definitions: {
				deny: {
					[CookieBox.names.denialDefault]: {
						description: 'The default description',
						behaviour: 'drop',
						group: 'general'
					}
				}
			}
		}

	export let options: ICookieBoxOptions
	         , interceptor: Interceptor
}

