export default interface ICookie {
	name: string,
	value: string,
	path?: string,
	domain?: string,
	'max-age'?: number,
	expires?: number,
	secure: boolean
}
