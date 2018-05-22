import { CookieBox } from '../CookieBox'
import ICookieDenial from '../interface/ICookieDenial'
import { Util } from './Util'


export module Ui {
	export const generateToggleList = (target: HTMLFormElement | Document = document) => {
		const createOnElement = (form: HTMLFormElement) => {
			const now = new Date().getTime()
			let introElement: HTMLElement

			if(CookieBox.options.list.intro) {
				if(typeof CookieBox.options.list.intro === 'string') {
					const p = document.createElement('p')
					p.textContent = CookieBox.options.list.intro

					introElement = p
				} else if(CookieBox.options.list.intro && HTMLElement.isPrototypeOf(CookieBox.options.list.intro.constructor)) {
					introElement = <HTMLElement> CookieBox.options.list.intro
				}
			}

			if(introElement) {
				const header: HTMLElement = <HTMLElement> document.createRange()
					.createContextualFragment(`<header>${introElement.outerHTML}</header>`)
					.children[0]

				form.appendChild(header)
			}

			const groupMap: {
				[key: string]: ICookieDenial[]
			} = {}

			Object.keys(CookieBox.options.definitions.deny)
				.forEach((cookieName: string) => {
					const cookie: ICookieDenial = CookieBox.options.definitions.deny[cookieName]
					if(!groupMap[cookie.group]) {
						groupMap[cookie.group] = []
					}

					groupMap[cookie.group].push(cookie)
				})

			Object.keys(groupMap)
				.forEach((groupKey: string) => {
					const group = groupMap[groupKey]

					const template: string = `
						<fieldset name="${groupKey}">
							<legend>${groupKey}</legend>
							<ul>
							${group.map((cookie: ICookieDenial) => `
								<li>
									<input type="checkbox"
									       id="c-${cookie.name}-${now}"
									       name="${cookie.name}"
									       ${CookieBox.interceptor.whitelist.isValid(cookie.name) ? 'checked' : ''}
									/>
									<label for="c-${cookie.name}-${now}">
										<var>${cookie.name}</var>
										<span>${cookie.description}</span>
									</label>
								</li>
							`).join('\n')}
							</ul>
						</fieldset>
					`,
						fieldset: HTMLFieldSetElement = <HTMLFieldSetElement> document.createRange()
							.createContextualFragment(template)
							.children[0]

					form.appendChild(fieldset)
				})

			if(CookieBox.options.list.submit.enabled) {
				const submit: HTMLButtonElement = document.createElement('button')
				submit.textContent = CookieBox.options.list.submit.text
				submit.addEventListener('click', () => {
					form.dispatchEvent(new Event('submit'))
				})
				form.appendChild(submit)
			}

			form.addEventListener('submit', event => {
				if(!CookieBox.options.list.submit.reload) {
					event.preventDefault()
				}

				updateWhitelist(form)
			})
		}

		if(target instanceof Document) {
			Array.prototype.forEach.call(target.querySelectorAll(`form.${CookieBox.names.anchorClassName}`), createOnElement)
		} else {
			createOnElement(target)
		}
	}

	export const updateLists = () => {
		document.querySelectorAll(`.${CookieBox.names.anchorClassName}`)

		Array.prototype.map
			.call(document.querySelectorAll(`.${CookieBox.names.anchorClassName} input[type='checkbox']`), (input: HTMLInputElement) => {
				input.checked = CookieBox.interceptor.whitelist.isValid(input.name)
			})
	}

	export const updateWhitelist = (cookiesOrForm?: string[] | HTMLFormElement) => {
		let cookies: string[] = []
		if(cookiesOrForm) {
			if(cookiesOrForm instanceof HTMLFormElement) {
				cookies = Array.prototype.filter
					.call(cookiesOrForm.querySelectorAll('input[type="checkbox"]'), (input: HTMLInputElement) => input.checked && input.name)
					.map((input: HTMLInputElement) => input.name)
			} else {
				cookies = cookiesOrForm
			}
		}

		const relevantCookies: string[] = Object.keys(Util.getCookiesList())
			.concat(cookies)
			.map((cookieName: string, index: number, array: string[]) => {
				if(array.indexOf(cookieName) !== index) {
					return null
				}
				return cookieName
			})
			.filter((cookieName: string) => cookieName)

		relevantCookies
			.forEach(name => {
				if(!CookieBox.interceptor.whitelist.isValid(name) && CookieBox.interceptor.whitelist.isValid(name, cookies)) {
					CookieBox.interceptor.allow(name)
				} else if(CookieBox.interceptor.whitelist.isValid(name) && !CookieBox.interceptor.whitelist.isValid(name, cookies)) {
					CookieBox.interceptor.deny(name)
				} else {
					Util.expireCookie(name)
				}
			})

		CookieBox.interceptor.whitelist.set(cookies)
		CookieBox.interceptor.whitelist.write()
		updateLists()
	}
}
