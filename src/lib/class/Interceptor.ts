import { CookieBox } from '../CookieBox'
import ICookie from '../interface/ICookie'
import ICookieDenial from '../interface/ICookieDenial'
import { Util } from '../module/Util'
import { CookieBehaviour, CookieBehaviourFunction } from '../types'
import Whitelist from './Whitelist'


export class Interceptor {
	/**
	 * This is the pseudo storage for cookies with a behaviour of "ghost" or "blank".
	 * Contents of this storage will be added to the fake cookie list but not get saved on the disk.
	 * @type {{}}
	 */
	public readonly pseudo: { [key: string]: ICookie } = {}
	public readonly whitelist: Whitelist
	private readonly _raw = {
		getter: document['__lookupGetter__']('cookie'),
		setter: document['__lookupSetter__']('cookie')
	}
	private readonly logger: Function = console.error

	public constructor() {
		this.whitelist = new Whitelist()
		this.whitelist.load()
	}

	public get cookie(): string {
		if(!CookieBox.options.observability.hide) {
			Util.setProtoTemp(String, 'raw', this.raw)
		}

		if(CookieBox.dev) {
			Util.setProtoTemp(String, 'cb', CookieBox)
			Util.setProtoTemp(String, 'pseudo', this.pseudo)
		}

		if(!CookieBox.options.active) return this.raw

		let cookieArr: ICookie[] = Util.getCookieObjects(this.raw)
		cookieArr = cookieArr
			.filter((cookie: ICookie) => cookie.name !== CookieBox.names.whitelistCookie)

		const pseudoCookies: ICookie[] = Object.keys(this.pseudo).map((key: string) => this.pseudo[key])
		cookieArr.forEach((cookie: ICookie, cookieIndex: number) => {
			pseudoCookies.forEach((pseudoCookie: ICookie) => {
				if(cookie.name === pseudoCookie.name) {
					cookieArr.splice(cookieIndex, 1)
				}
			})
		})
		cookieArr.push(...pseudoCookies)

		return cookieArr.map((cookie: ICookie) => Util.cookieToString(cookie)).join('; ')
	}

	public set cookie(input: string) {
		if(!CookieBox.options.active) {
			this.raw = input
			return
		}

		const report = (message: string) => {
			if(CookieBox.options.observability.quiet) return
			if(CookieBox.options.observability.throw) {
				throw new Error(message)
			}
			this.logger(message)
		}

		if(input.indexOf('=') === -1) {
			report('Invalid cookie declaration')
			return
		}

		const cookieObj = Util.parseCookieString(input)

		if(!this.whitelist.isValid(cookieObj.name)) {
			if(CookieBox.options.observability.verbose) {
				console.info(`Something tried to set cookie "${cookieObj.name}".`)
			}

			const message: string = `Cookie "${cookieObj.name}" not allowed!`
			const cookieSettings: ICookieDenial = CookieBox.options.definitions.deny[cookieObj.name]
			let setAnyways: boolean = false

			if(cookieSettings) {
				let behaviour: CookieBehaviour = cookieSettings.behaviour

				if(typeof cookieSettings.behaviour === 'function') {
					behaviour = <CookieBehaviourFunction>(cookieSettings.behaviour)(cookieObj)
					if(!behaviour) return
				}

				switch(cookieSettings.behaviour) {
					case 'deny': {
						report(message)
						break
					}
					case 'blank': {
						setAnyways = true

						this.pseudo[cookieObj.name] = Object.assign({}, cookieObj)

						cookieObj.value = ''
						input = Util.cookieToString(cookieObj)
						break
					}
					case 'ghost': {
						this.pseudo[cookieObj.name] = cookieObj
						return
					}
				}
			} else {
				report(message)
			}

			if(!setAnyways) return
		}

		this.raw = input
	}

	public get raw(): string {
		return this._raw.getter.apply(document)
	}

	public set raw(input: string) {
		this._raw.setter.apply(document, [input])
	}

	public allow(cookieName: string): void {
		this.whitelist.allow(cookieName)

		if(CookieBox.options.whitelist.inheritAllowed) {
			if(this.pseudo[cookieName]) {
				this.cookie = Util.cookieToString(this.pseudo[cookieName], true)
			}
		} else {
			Util.expireCookie(name)
		}

		delete this.pseudo[cookieName]
	}

	public deny(cookieName: string): void {
		if(CookieBox.options.whitelist.keepDenied) {
			this.pseudo[cookieName] = Util.getCookieObject(cookieName)
		}

		Util.expireCookie(cookieName)

		this.whitelist.deny(cookieName)
	}
}
