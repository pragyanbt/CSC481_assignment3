const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Adjust the path to point to TicketSale.sol
const ticketSalePath = path.resolve(__dirname, 'contracts', 'TicketSale.sol');
const source = fs.readFileSync(ticketSalePath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'TicketSale.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
};

const solcVersion = 'v0.8.17';

function findImports(path) {
    return {
        contents: fs.readFileSync(path).toString()
    };
}

const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

console.log('Compilation output:', output);

if (output.errors) {
    console.error('Compilation errors:', output.errors);
}

const contract = output.contracts['TicketSale.sol']['TicketSale'];

if (!contract) {
    console.error('Contract not found in compilation output');
} else {
    console.log('Contract ABI:', contract.abi);
    console.log('Contract bytecode:', contract.evm.bytecode.object);
}

module.exports = {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object,
};
