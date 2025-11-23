import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string;
    protected components: string[];

    constructor(source: string[] = [], delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
        this.components = source.slice(); 
    }

    private escape(component: string): string {
        return component
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
    }


    private unescape(component: string): string {
        let result = "";
        let escaped = false;

        for (const ch of component) {
            if (escaped) {
                result += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else {
                result += ch;
            }
        }
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.map(c => this.escape(c)).join(delimiter);
    }

    public asDataString(): string {
        return this.asString(this.delimiter);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.validateIndex(i);
        return this.unescape(this.components[i]);
    }

    public setComponent(i: number, c: string): void {
        this.validateIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length)
            throw new Error("Index out of range");
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.validateIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        const toAdd: string[] = [];
        for (let i = 0; i < other.getNoComponents(); i++) {
            toAdd.push(other.getComponent(i));
        }
        this.components.push(...toAdd);
    }
    private validateIndex(i: number): void {
        if (i < 0 || i >= this.components.length)
            throw new Error(`Index ${i} out of range (0..${this.components.length - 1})`);
    }
}
