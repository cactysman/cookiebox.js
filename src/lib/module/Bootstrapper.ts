import { Interceptor } from '../class/Interceptor'
import { CookieBox } from '../CookieBox'
import { Ui } from './Ui'
import { Util } from './Util'


const merge = require('deepmerge')

export module Bootstrapper {
	export const run = () => {
		setup()
		inject()

		document.addEventListener('DOMContentLoaded', () => {
			Ui.generateToggleList()
		})

		const callbackOptions = CookieBox.options.callbacks
		console.log(Util.getCookie(CookieBox.names.whitelistCookie, CookieBox.interceptor.raw))
		if(!Util.getCookieObject(CookieBox.names.whitelistCookie, CookieBox.interceptor.raw) && callbackOptions.initialVisit) {
			callbackOptions.initialVisit()
				.then(() => {
					callbackOptions.afterSetup(true)
				})
		} else {
			callbackOptions.afterSetup(false)
		}
	}

	export const setup = () => {
		CookieBox.options = CookieBox.optionsDefault

		const scripts: NodeListOf<HTMLScriptElement> = document.querySelectorAll('script'),
			tag: HTMLScriptElement = <HTMLScriptElement> scripts[scripts.length - 1]

		const userOptions = window[CookieBox.names.settingsObject]
		if(userOptions) {
			CookieBox.options = merge.all([CookieBox.optionsDefault, userOptions])

			if(userOptions.list.intro) { // deepmerge doesn't merge HTMLElements :(
				CookieBox.options.list.intro = userOptions.list.intro
			}

			Object.keys(CookieBox.options.definitions.deny)
				.forEach((cookieName: string) => {
					if(cookieName === CookieBox.names.denialDefault) return

					if(!CookieBox.options.definitions.deny[cookieName].name) {
						CookieBox.options.definitions.deny[cookieName].name = cookieName
					}

					return merge.all([CookieBox.options.definitions.deny[CookieBox.names.denialDefault], CookieBox.options.definitions.deny[cookieName]])
				})

			delete CookieBox.options.definitions.deny[CookieBox.names.denialDefault]
			delete window[CookieBox.names.settingsObject]
		}

		if(!CookieBox.options) {
			CookieBox.options = CookieBox.optionsDefault
		}

		if(document.readyState !== 'complete' && CookieBox.options.observability.hide) {
			tag.remove()

			Array.prototype.forEach.call(document.querySelectorAll('script'), (scriptTag: HTMLScriptElement) => {
				if(scriptTag.textContent.toString().includes('CookieBoxSettings')) {
					scriptTag.remove()
				}
			})
		}


		CookieBox.interceptor = new Interceptor()

		if(document.cookie.length) {
			Object.keys(Util.getCookiesList())
				.forEach(name => {
					if(!CookieBox.interceptor.whitelist.isValid(name)) Util.expireCookie(name)
				})
		}
	}

	export const inject = () => {
		Object.defineProperty(document, 'cookie', {
			set: function(input: string) {
				return CookieBox.interceptor.cookie = input
			},
			get: function() {
				return CookieBox.interceptor.cookie
			},
			configurable: true
		})

		const documentCreateElement = document.createElement
		const newDocumentCreateElement = function(tagName: string, options: ElementCreationOptions): HTMLElement {
			if(tagName === CookieBox.names.createElement) {
				const container: HTMLFormElement = documentCreateElement.call(document, 'form')
				container.classList.add(CookieBox.names.formClassName)

				Ui.generateToggleList(container)
				return container
			}
			return documentCreateElement.call(document, tagName, options)
		}

		eval('document.createElement = newDocumentCreateElement')

		const ObjectDefineProperty = Object.defineProperty
		Object.defineProperty = function(o: any, p: string, attributes: PropertyDescriptor & ThisType<any>): any {
			if(o === document && p.trim() === 'cookie') return o
			return ObjectDefineProperty(o, p, attributes)
		}
	}
}
