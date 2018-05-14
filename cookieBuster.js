const scripts = document.querySelectorAll('script')
	, tag = scripts[scripts.length - 1]

eval(tag.textContent)
tag.remove()

const COOKIEBUSTER_DEV = true

const getCookies = () => {
	const cookiesObj = {}
		, cookiesArr = document.cookie.length ? document.cookie.split(';').map(cookieString => {
			return parseCookieString(cookieString)
		}) : []

	for(let cookie of cookiesArr) {
		cookiesObj[cookie.name] = cookie.value
	}

	return cookiesObj
}

const parseCookieString = string => {
	const parts = string.trim().split(/^([^=]*)=/).filter(x => x)
	return {
		name: parts[0],
		value: parts[1]
	}
}

const getCookie = name => {
	return getCookies()[name]
}

const expireCookie = name => {
	document.cookie = `${name}=;expires=${new Date(0).toUTCString()};path=/`
}

let initToggleList
let updateWhitelist

(() => {
	initToggleList = (target = document) => {
		target.querySelectorAll('.cookieBusterToggle input[type="checkbox"]').forEach(input => {
			input.checked = (cookieBuster.whitelist.indexOf(input.name) !== -1)
			input.title = (cookieBuster.whitelist.indexOf(input.name) !== -1).toString()
		})
	}

	updateWhitelist = cookies => {
		if(!cookies) {
			cookies = Array.prototype.map.call(document.querySelectorAll('.cookieBusterToggle input'), x => x.checked && x.name).filter(x => x)
		}

		Object.keys(getCookies()).forEach(name => {
			if(!cookieBuster.isValidCookie(name, cookies)) expireCookie(name)
		})

		cookieBuster.whitelist = cookies

		if(COOKIEBUSTER_DEV) {
			cookies.forEach(name => {
				document.cookie = `${name}=${new Date().getTime()}`
			})
		}

		document.cookie = `${cookieBusterWhitelistCookieName}=${btoa(cookieBuster.whitelist.join('='))}`
	}

	window.CookieBusterSettings = window.CookieBusterSettings || {}

	const cookieBusterWhitelistCookieName = '__cookieBusterWhitelist'
	const cookieBuster = {
		options: window.CookieBusterSettings,
		logger: console.error,
		raw: {
			getter: document.__lookupGetter__('cookie'),
			setter: document.__lookupSetter__('cookie')
		},
		whitelist: [],
		initToggleList: initToggleList,
		updateWhitelist: updateWhitelist,
		isValidCookie: (name, list = cookieBuster.whitelist) => {
			return name === cookieBusterWhitelistCookieName || list.indexOf(name) !== -1
		}
	}
	delete window.CookieBusterSettings

	if(getCookie(cookieBusterWhitelistCookieName)) {
		const whitelist = atob(getCookie(cookieBusterWhitelistCookieName)).split('=')

		for(let cookieName of whitelist) {
			if(cookieBuster.whitelist.indexOf(cookieName) === -1) {
				cookieBuster.whitelist.push(cookieName)
			}
		}
	}

	if(document.cookie.length) {
		Object.keys(getCookies()).forEach(name => {
			if(!cookieBuster.isValidCookie(name)) expireCookie(name)
		})
	}

	Object.defineProperty(document, 'cookie', {
		set: function(input) {
			if(input.indexOf('=') === -1) {
				const string = 'Invalid cookie declaration'

				if(cookieBuster.options.throw) {
					throw new Error(string);
				} else {
					if(!cookieBuster.options.quiet) cookieBuster.logger(string)
					return
				}
			}

			const cookie = parseCookieString(input)

			if(!cookieBuster.isValidCookie(cookie.name)) {
				const string = `Cookie "${cookie.name}" not allowed!`
				if(cookieBuster.options.throw) {
					throw new Error(string);
				} else {
					if(!cookieBuster.options.quiet) cookieBuster.logger(string)
					return
				}
			}

			console.log('SET', input)
			cookieBuster.raw.setter.apply(document, [input]);
		},
		get: function() {
			const response = cookieBuster.raw.getter.apply(document)
			String.prototype.cb = JSON.parse(JSON.stringify(cookieBuster))
			setTimeout(function() {
				String.prototype.cb = undefined
			}, 0)
			return response;
		},
		configurable: true
	})

	const ObjectDefineProperty = Object.defineProperty
	Object.defineProperty = function(obj, prop, descriptor) {
		if(obj === document && prop.trim() === 'cookie') return obj
		return ObjectDefineProperty(obj, prop, descriptor)
	}
})()
