(() => {
	if(eval('typeof document') === 'undefined') {
		console.error('Hey, I need a browser to work correctly! Please run me in a browser.')
		return
	}

	const {  Bootstrapper } = require('./lib/CookieBox')
	Bootstrapper.run()
})()
