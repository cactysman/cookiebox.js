const content = document.createElement('div')
content.appendChild(document.importNode(document.querySelector('#cookieBusterConfigurator').content, true))

initToggleList(content)

swal({
	title: '🍪 Cookie preferences',
	buttons: {
		cancel: 'Cancel',
		danger: 'Reset',
		save: 'Save',
	},
	closeOnClickOutside: false,
	content: content
})
	.then(value => {
		switch(value) {
			case 'cancel': {
				history.back()
				break
			}
			case 'save': {
				updateWhitelist()
				swal('Saved', 'Your cookie preferences were saved!', 'success')
				break
			}
			case 'danger': {
				expireCookie('__cookieBusterWhitelist')
				location.reload()
				break
			}
		}
	})
