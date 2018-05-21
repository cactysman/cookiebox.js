import { CookieBox } from '../CookieBox'
import ICookie from '../interface/ICookie'
import { ICookieList } from '../interface/ICookieList'


export module Util {
	export const getCookieObjects = (source: string = document.cookie): ICookie[] => {
		return !source.length
			? []
			: source.split(';').map((cookieString: string) => {
				return parseCookieString(cookieString)
			})
	}
	export const getCookiesList = (source: string = document.cookie): ICookieList => {
		const cookiesObj: ICookieList = {}
			, cookiesArr: ICookie[] = getCookieObjects(source)

		for(let cookie of cookiesArr) {
			cookiesObj[cookie.name] = cookie.value
		}

		return cookiesObj
	}

	export const getCookieObject = (name: string, source: string = document.cookie): ICookie => {
		let cookieObj: ICookie = null
		getCookieObjects(source).forEach((cookie: ICookie) => {
			if(cookie.name === name) {
				cookieObj = cookie
				return true
			}
		})

		return cookieObj
	}

	export const getCookie = (name: string, source: string = document.cookie): string => {
		return getCookiesList(source)[name]
	}

	export const parseCookieString = (string: string): ICookie => {
		const cookie: ICookie = {} as ICookie
		const parts: string[][] = string.trim().split(/; ?/).map(x => x.split('='))

		cookie.name = parts[0][0]
		cookie.value = parts[0][1]

		parts.forEach((v: string[], k: number) => {
			if(k === 0) return false
			cookie[v[0]] = v[1]
		})

		return cookie
	}

	export const expireCookie = (name: string) => {
		CookieBox.interceptor.raw = `${name}=;max-age=0`
	}

	export const cookieToString = (cookie: ICookie, full = false): string => {
		if(!cookie) return ''

		const parts: string[] = [
			`${cookie.name}=${cookie.value}`
		]

		if(full) {
			Object.keys(cookie).forEach((key: string) => {
				if(['name', 'value'].indexOf(key) === -1) {
					parts.push(`${key}=${cookie[key]}`)
				}
			})
		}

		return parts.join('; ')
	}

	export const setProtoTemp = (object: any, prop: string, value: any) => {
		object.prototype[prop] = value
		setTimeout(() => { delete object.prototype[prop] }, 0)
	}
}
