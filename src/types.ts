import type { Server } from 'http';

export type ServerFn = (Server) => void;

export interface Options {
  port?: number;
  public?: string;
  beforeListen?: ServerFn;
  afterListen?: ServerFn;
}
