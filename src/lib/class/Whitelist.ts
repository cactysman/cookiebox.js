import { CookieBox } from '../CookieBox'
import { Util } from '../module/Util'


export default class Whitelist {
	private readonly content: string[] = []

	public allow(cookie: string) {
		this.content.push(cookie)
	}

	public deny(cookie: string) {
		this.content.splice(this.content.indexOf(cookie), 1)
	}

	public get(): string[] {
		return this.content.slice()
	}

	public has(cookie: string): boolean {
		return this.content.indexOf(cookie) !== -1
	}

	public isValid(cookie: string, list: string[] = this.get()): boolean {
		return cookie === CookieBox.names.whitelistCookie || list.indexOf(cookie) !== -1
	}

	public load() {
		let cookies: string[] = []

		if(Util.getCookie(CookieBox.names.whitelistCookie)) {
			cookies = cookies.concat(atob(Util.getCookie(CookieBox.names.whitelistCookie)).split('=').filter(x => x))
		}

		if(CookieBox.options.definitions.allow) {
			cookies = cookies.concat(CookieBox.options.definitions.allow)
		}

		if(cookies.length) this.set(cookies)
	}

	public set(content: string[]) {
		while(this.content.length) {
			this.content.pop()
		}
		this.content.push(...content)
	}

	public write() {
		document.cookie = `${CookieBox.names.whitelistCookie}=${btoa(this.content.join('='))};path=${CookieBox.options.whitelist.path};max-age=${CookieBox.options.whitelist.expiry}`
	}
}
