import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {
    protected delimiter: string;
    protected name: string;
    protected noComponents: number;

    constructor(source: string = "", delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
        this.name = source;
        this.noComponents = this.parseComponents().length;
    }

    private escapeComponent(component: string): string {
        return component
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
    }

    private parseComponents(): string[] {
        const result: string[] = [];
        let current = "";
        let escaped = false;

        for (const ch of this.name) {
            if (escaped) {
                current += ch;
                escaped = false;
            } else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            } else if (ch === this.delimiter) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }

        result.push(current);
        return result;
    }

    private rebuild(components: string[]): void {
        this.name = components.map(c => this.escapeComponent(c)).join(this.delimiter);
        this.noComponents = components.length;
    }

    public asString(delimiter: string = this.delimiter): string {
        const components = this.parseComponents();
        return components.join(delimiter);
    }

    public asDataString(): string {
        return this.name;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents === 0 || this.name.length === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const components = this.parseComponents();
        if (i < 0 || i >= components.length)
            throw new Error(`Index ${i} out of range`);
        return components[i];
    }

    public setComponent(i: number, c: string): void {
        const components = this.parseComponents();
        if (i < 0 || i >= components.length)
            throw new Error(`Index ${i} out of range`);
        components[i] = c;
        this.rebuild(components);
    }

    public insert(i: number, c: string): void {
        const components = this.parseComponents();
        if (i < 0 || i > components.length)
            throw new Error(`Index ${i} out of range`);
        components.splice(i, 0, c);
        this.rebuild(components);
    }

    public append(c: string): void {
        const components = this.parseComponents();
        components.push(c);
        this.rebuild(components);
    }

    public remove(i: number): void {
        const components = this.parseComponents();
        if (i < 0 || i >= components.length)
            throw new Error(`Index ${i} out of range`);
        components.splice(i, 1);
        this.rebuild(components);
    }

    public concat(other: Name): void {
        const components = this.parseComponents();
        for (let i = 0; i < other.getNoComponents(); i++) {
            components.push(other.getComponent(i));
        }
        this.rebuild(components);
    }
}
