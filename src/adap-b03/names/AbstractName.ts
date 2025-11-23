import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

/**
 * Abstract base class for a structured name (e.g., hierarchical names).
 * Derived classes only need to store the components of the name and
 * implement the component access methods.
 */
export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    /** Clone by creating a new instance with the same components */
    public clone(): Name {
        const cloned = this.createEmpty(this.delimiter);
        for (let i = 0; i < this.getNoComponents(); i++) {
            cloned.append(this.getComponent(i));
        }
        return cloned;
    }

    /** Concrete classes must return a new empty instance of their type */
    protected abstract createEmpty(delimiter: string): AbstractName;

    /** Convert to string using delimiter, escaping as required */
    public asString(delimiter: string = this.delimiter): string {
        const escaped = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            escaped.push(this.escapeComponent(this.getComponent(i)));
        }
        return escaped.join(delimiter);
    }

    /** Default string representation */
    public toString(): string {
        return this.asDataString();
    }

    /** Internal data string representation (same as asString by default) */
    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) return false;

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) return false;
        }

        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const str = this.asDataString();

        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
        }

        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** Concatenate another name’s components into this one */
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

    /** Escape the delimiter and escape character in components */
    protected escapeComponent(c: string): string {
        return c
            .replace(new RegExp(ESCAPE_CHARACTER, "g"), ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replace(new RegExp(this.delimiter, "g"), ESCAPE_CHARACTER + this.delimiter);
    }

    // Abstract interface (storage defined by child class)
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;
    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}
