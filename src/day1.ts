import {
  ReadableStream,
  Transformer,
  TransformStream,
  TransformStreamDefaultController,
} from 'stream/web';
import { readInput } from './lib.js';

export async function part1(path: string) {
  const readable = (await readInput(path)).pipeThrough(
    new TransformStream<string, number>(numberTransformer()),
  );

  const rises = await risingSink(readable);
  return rises;
}

export async function part2(path: string): Promise<number> {
  const readable = (await readInput(path))
    .pipeThrough(new TransformStream<string, number>(numberTransformer()))
    .pipeThrough(new TransformStream<number, number[]>(groupTransformer(3)))
    .pipeThrough(new TransformStream<number[], number>(sumTransformer()));

  const rises = await risingSink(readable);
  return rises;
}

function numberTransformer(): Transformer<string, number> {
  return {
    transform(
      chunk: string,
      controller: TransformStreamDefaultController<number>,
    ) {
      controller.enqueue(Number(chunk));
    },
  };
}

function groupTransformer<T>(size: number): Transformer<T, T[]> {
  let groups: T[][] = [];

  return {
    transform(chunk: T, controller: TransformStreamDefaultController<T[]>) {
      groups.push([]);
      groups.forEach((value) => value.push(chunk));

      if (groups[0].length > size - 1) {
        const group = groups.shift();
        controller.enqueue(group);
      }
    },
  };
}

function sumTransformer(): Transformer<number[], number> {
  return {
    transform(
      chunk: number[],
      controller: TransformStreamDefaultController<number>,
    ) {
      controller.enqueue(
        chunk.reduce((prev, current) => prev + Number(current), 0),
      );
    },
  };
}

async function risingSink(input: ReadableStream<number>): Promise<number> {
  let prev = Number.MAX_SAFE_INTEGER;
  let curr = 0;
  let acc = 0;
  for await (const chunk of input) {
    curr = chunk;

    if (prev < curr) {
      acc += 1;
    }

    prev = curr;
  }

  return acc;
}
