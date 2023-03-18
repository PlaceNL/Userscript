import {EN} from './en.js';
import {NL} from './nl.js';

export function lang() {
    if (navigator.languages.includes('nl')) return NL;

    return EN;
}
