# Configuration
>	Most configuration option are optional, as there are default values
	to them. **Required** options will be marked as such.

*	`active` (**boolean**, default: *false*):

	Defines whether **CookieBox** is active or not.

*	`callbacks` (**object**):

	Defines a set of callbacks that **CookieBox** executes after certain
	actions.

	*	`initialVisit` (**[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)**):

		Gets called when the visitor does not hold a whitelist cookie
		(so it most likely is their first visit).
		
	*	`afterSetup` (**function(initial: boolean)**):

		Gets called after either the **CookieBox** whitelist was
		configured on the visitor's initial visit or when they load the
		page but it's not the first time.
		
	*	`filled` (**function(form: HTMLFormElement)**):

		Gets called after a **CookieBox** form was created either
		through `document.createElement('cookieboxlist')` or DOM
		contents with the `cookie-box--form` class.

*	`definitions` (**object**):

	Definitions for cookie handling.

	*	`allow` (**string[]**, default: *empty array*):

		A list of cookies that will be allowed by default, such as
		cookies for cookie banners or language selection on your site.

	*	`deny` (**object**):

		A named list of objects that define the denial behaviour of
		individual cookies.

		The **key** is the name of the given cookie.

		*	*`cookie name`* (**string**) => {

			*	`description` (**string**, *required*, default: *'The
				default description'*)

				A description that will be listed alongside the cookie
				name in the cookie whitelist configuration list.

			*	`behaviour` ([**CookieBehaviour**](#cookie-behaviours),
				*required*, default: *'drop'*)

				The expected denial behaviour for this cookie. 

			*	`group` (**string**, default: *'general'*)

				The name for the group to list this cookie in.

			}

*	`list` (**object**):

	Holds a few options for the generated whitelist settings list.

	*	`intro` ([**HTMLElement**](https://developer.mozilla.org/docs/Web/API/HTMLElement)
		or **string**, default: *'Please set up your preferences
		regarding cookies on this website.'*):

		Defines a custom [*HTMLElement*](https://developer.mozilla.org/docs/Web/API/HTMLElement)
		(or, if you use a string, a
		[*\<p>aragraph tag*](https://www.w3schools.com/tags/tag_p.asp))
		that will be used as the introductional content on the list.

	*	`submit` (**object**):

		Options for the submit button. Rendering of said button requires
		`enabled` to be *true*.

		*	`enabled` (**boolean**, default: *true*):

			Should the list contain a submit button? (allows custom
			submission methods if disables like in the
			[**example**](../example/index.html)).

		*	`text` (**string**, default: *'Save'*):

			The label that goes on the button.

		*	`reload` (**boolean**, default: *false*):

			Should hitting the button reload the page?

*	`observability` (**object**):

	Holds a set of options for observability of **CookieBox**.

	> Warning: weird settings ahead. ***#todo***

	*	`hide` (**boolean** or **'tag'**, default: *false*):

		Defines whether **CookieBox** should hide itself to avoid being
		spotted by other applications loaded on the site.
	*	`throw` (**boolean**, default: *false*):

		Should **CookieBox** throw exceptions for cookies with the
		"*deny*" behaviour? (If disabled, it will print to the error
		stream)
	*	`quiet` (**boolean**, default: *false*):

		Should **CookieBox** not give any feedback at all when cookies
		with the "*deny*" behaviour are attempted to be written to?
	*	`verbose` (**boolean**, requires `hide` and `quiet` to be
		**false**):

		Should **CookieBox** print a message to the console when a
		denied cookie is attempted to be written to?

*	`whitelist` (**object**):

	Settings for the whitelist and its cookie.

	*	`expiry` (**number**, default: *1 year and &frac14; day
		(31557600)*):

		How long the whitelist cookie will be kept after setting /
		updating.

	*	`path` (**string**, default: *'/'*):

		The path in which the whitelist cookie will be stored.

	*	`updates` (**object**):

		Rules to apply when updating the whitelist.

		*	`inheritAllowed` (**boolean**, default: *false*):
	
			Defines whether cookies that are being allowed will be drawn
			from memory ((*blank* and *ghost* behaviour](#pseudo-storage))
			into an actual cookie.
	
		*	`keepDenied` (**boolean**, default: *false*):
	
			Defines whether cookies that are being denied will be kept
			in memory ((*blank* and *ghost* behaviour](#pseudo-storage)).

## Cookie behaviours
There are 5 cookie denial behaviours available to choose from. Although
they will not get saved to the disk as they woul be if **CookieBox**
wasn't active, some of the behaviours also house special treatments.

*	🚫 `deny`

	The cookie is denied and, according to the configuration options,
	**CookieBox** will either throw an
	[*exception*](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/throw),
	[*log an error*](https://developer.mozilla.org/docs/Web/API/Console/error)
	to the error stream or do nothing at all.

*	🚮 `drop`

	The cookie will simply be dropped.

*	❓ `blank`

	The cookie *will* be saved, although the value will be blank.
	
	The full cookie will be saved in the
	[pseudo storage](#pseudo-storage) though.

*	👻 `ghost`

	The cookie will only be saved in the
	[pseudo storage](#pseudo-storage). 

*	a custom function

## Pseudo storage
The pseudo storage is **CookieBox**'s way to fake set cookies, when
they actually have not been written to the disk.

Queries to `document.cookie` will return a list that contains the fake
cookies with their values. 
