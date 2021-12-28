// const chalk = require('chalk');
import chalk from 'chalk';
import { part1 as day1Part1, part2 as day1Part2 } from './day1.js';

void (async function () {
  console.log(
    chalk.green(`Day 1 Part 1: ${await day1Part1('input/day1.txt')}`),
  );
  console.log(
    chalk.green(`Day 1 Part 2: ${await day1Part2('input/day1.txt')}`),
  );
})();
