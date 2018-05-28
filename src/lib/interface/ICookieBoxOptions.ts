import ICookieDenial from './ICookieDenial'


export default interface ICookieBoxOptions {
	active?: boolean
	callbacks?: {
		initialVisit?: () => Promise<any>
		afterSetup?: (initial: boolean) => any,
		filled?: (form: HTMLFormElement) => any
	}
	definitions?: {
		allow?: string[]
		deny?: {
			[key: string]: ICookieDenial
		}
	}
	list?: {
		intro?: string | HTMLElement
		submit?: {
			enabled?: boolean
			text?: string
			reload?: boolean
		}
	}
	observability?: {
		hide?: boolean | 'tag'
		throw?: boolean
		quiet?: boolean
		verbose?: boolean
	}
	whitelist?: {
		expiry?: number
		path?: string
		updates?: {
			inheritAllowed?: boolean
			keepDenied?: boolean
		}
	}
}
