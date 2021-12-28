// const chalk = require('chalk');
import chalk from 'chalk';
import * as fs from 'node:fs';
import * as pathlib from 'node:path';
import { Readable, Transform } from 'node:stream';
import { ReadableStream } from 'node:stream/web';

export async function readInput(path: string): Promise<ReadableStream<string>> {
  const combined = pathlib.join(process.cwd(), path);

  fs.stat(combined, (err) => {
    if (err) {
      console.error(chalk.red(`path ${combined} is not valid`));
      process.exit(1);
    }
  });

  const stream = fs.createReadStream(combined);
  // @ts-ignore
  return Readable.toWeb(stream.pipe(toLines()));
}

function toLines() {
  let leftover: string | undefined = '';
  return new Transform({
    writableObjectMode: false,
    readableObjectMode: true,
    transform(chunk, _encoding, callback) {
      try {
        const lines = (leftover + chunk).split(/\r?\n/g);
        leftover = lines.pop();
        for (const line of lines) {
          this.push(line);
        }
        callback();
      } catch (err: any) {
        callback(err);
      }
    },
    flush(callback) {
      if (leftover !== '') {
        this.push(leftover);
      }
      callback();
    },
  });
}
