import { git } from '../contexts/git';
import { github } from '../contexts/github';
import { version } from '../contexts/version';

export type Token = string | number | boolean;
export type TokenMap = { [key: string]: Token };
export type TokenCallback = (value: Token, key: string) => void;

export class Context {
  private static instance: Context;
  private tokens = new Map<string, Token>();

  static async boot(): Promise<Context> {
    const instance = new Context();
    instance
      .set('version', version())
      .setMany(await git()) // git context
      .setMany(github()); // GitHub context

    return instance;
  }

  static async getInstance(): Promise<Context> {
    return Context.instance ?? (await Context.boot());
  }

  get<T extends Token = string>(key: string): T {
    const keys = key.split('|');
    const theKey = keys.find(k => this.tokens.get(k));

    return (theKey ? this.tokens.get(theKey) : '') as T;
  }

  set(key: string, value: Token | (() => Token)): Context {
    const theValue: Token = typeof value !== 'function' ? value : value();
    this.tokens.set(key, theValue);

    return this;
  }

  setMany(map: TokenMap | (() => TokenMap)): Context {
    const theMap: TokenMap = typeof map !== 'function' ? map : map();
    Object.keys(theMap).forEach((key: string) => {
      this.tokens.set(key, theMap[key]);
    });

    return this;
  }

  forEach(callback: TokenCallback): void {
    this.tokens.forEach(callback);
  }
}
