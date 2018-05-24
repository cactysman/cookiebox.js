import { CookieBehaviour } from '../types'


export default interface ICookieDenial {
	name?: string,
	description: string,
	behaviour: CookieBehaviour,
	group?: string,
}
