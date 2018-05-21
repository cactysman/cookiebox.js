import ICookieDenial from './ICookieDenial'


export default interface ICookieBoxOptions {
	active?: boolean,
	callbacks?: {
		initialVisit?: () => Promise<any>,
		afterSetup?: (initial: boolean) => any
	},
	observability?: {
		hide?: boolean | 'tag',
		throw?: boolean,
		quiet?: boolean,
		verbose?: boolean
	},
	list?: {
		intro?: string | HTMLElement,
		submit?: {
			text?: string
			reload?: boolean
		}
	},
	whitelist?: {
		expiry?: number,
		path?: string,
		inheritAllowed?: boolean,
		keepDenied?: boolean
	},
	definitions?: {
		allow?: string[],
		deny?: {
			[key: string]: ICookieDenial
		}
	}
}
