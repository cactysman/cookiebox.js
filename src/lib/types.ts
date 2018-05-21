import ICookie from './interface/ICookie'


export type CookieBehaviourFunction = (cookie: ICookie) => (CookieBehaviour | boolean | null | undefined | void | never)
export type CookieBehaviour = ('deny' | 'drop' | 'blank' | 'ghost' | CookieBehaviourFunction)
