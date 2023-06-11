import { Command } from 'commander';

const program = new Command();

program
    .option('-p, --persistence <persistence>', 'Type of persistence', 'MONGO')
program.parse();

export default program.opts();
