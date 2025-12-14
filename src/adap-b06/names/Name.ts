import { Equality } from "../common/Equality";
import { Cloneable } from "../common/Cloneable";
import { Printable } from "../common/Printable";

export interface Name extends Cloneable, Printable, Equality {

    /**
     * Returns true, if number of components == 0; else false
     */
    isEmpty(): boolean;

    /** 
     * Returns number of components in Name instance
     */
    getNoComponents(): number;

    getComponent(i: number): string;

    /** 
     * Returns a new Name with the component at index i set to c
     * Expects that new Name component c is properly masked 
     */
    setComponent(i: number, c: string): Name;

    /** 
     * Returns a new Name with component c inserted at index i
     * Expects that new Name component c is properly masked 
     */
    insert(i: number, c: string): Name;

    /** 
     * Returns a new Name with component c appended at the end
     * Expects that new Name component c is properly masked 
     */
    append(c: string): Name;

    /** 
     * Returns a new Name with the component at index i removed 
     */
    remove(i: number): Name;
    
    /** 
     * Returns a new Name that is the concatenation of this and other 
     */
    concat(other: Name): Name;
    
}