import { Command } from 'commander';

const program = new Command();

program
    .option('-p, --persistence <persistence>', 'Type of persistence', 'MONGO')
    .option('-e, --environment <environment>', 'Type of environment', 'PRODUCTION')
program.parse();

export default program.opts();
