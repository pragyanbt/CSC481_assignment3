const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const { abi, bytecode } = require("../compile");

let accounts;
let ticketSale;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    // Providing initial values for numTickets and price
    const initialNumTickets = 10; 
    const ticketPrice = web3.utils.toWei('0.1', 'ether'); 

    ticketSale = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [initialNumTickets, ticketPrice] })
        .send({ from: accounts[0], gas: '6000000' });
});

describe("TicketSale", () => {
    it("deploys a contract", () => {
        assert.ok(ticketSale.options.address);
    });

    it("checks the owner", async () => {
        const contractOwner = await ticketSale.methods.manager().call();
        assert.equal(contractOwner, accounts[0]);
    });

    it("buys a ticket", async () => {
        await ticketSale.methods.buyTicket(1).send({
            from: accounts[1],
            value: web3.utils.toWei('0.1', 'ether'), // Adjusting according to the ticket price
            gas: '3000000'
        });

        const ticketsOwned = await ticketSale.methods.getTicketOf(accounts[1]).call();
        assert.equal(ticketsOwned.toString(), '1'); // Adjusting based on ticket ID
    });

    it("offers a swap", async () => {
        await ticketSale.methods.buyTicket(1).send({
            from: accounts[1],
            value: web3.utils.toWei('0.1', 'ether'),
            gas: '3000000'
        });

        await ticketSale.methods.offerSwap(1).send({ from: accounts[1], gas: '3000000' });
        const swapOwner = await ticketSale.methods.swapOffers(1).call();
        assert.equal(swapOwner, accounts[1]); // Ensure the swap offer is registered
    });

    it("accepts a swap", async () => {
        // Account 1 buys a ticket
        await ticketSale.methods.buyTicket(1).send({
            from: accounts[1],
            value: web3.utils.toWei('0.1', 'ether')
        });
        
        // Account 2 buys another ticket
        await ticketSale.methods.buyTicket(2).send({
            from: accounts[2],
            value: web3.utils.toWei('0.1', 'ether')
        });
        
        // Account 1 offers a swap for ticket 1
        await ticketSale.methods.offerSwap(1).send({ from: accounts[1] });
    
        // Account 2 accepts the swap for ticket 1
        await ticketSale.methods.acceptSwap(1).send({ from: accounts[2] });
    
        // Debugging assertions
        const ticketsOwnedByNewOwner = await ticketSale.methods.getTicketOf(accounts[2]).call();
        console.log("Account 2 ticket after accepting swap:", ticketsOwnedByNewOwner);
        assert.equal(ticketsOwnedByNewOwner.toString(), '1'); // Ensure account 2 now has ticket 1
        
        const ticketsOwnedByOldOwner = await ticketSale.methods.getTicketOf(accounts[1]).call();
        console.log("Account 1 ticket after accepting swap:", ticketsOwnedByOldOwner);
        assert.equal(ticketsOwnedByOldOwner.toString(), '2'); // Ensure account 1 now has ticket 2
    });
    
    
    

    it("resells a ticket", async () => {
        await ticketSale.methods.buyTicket(1).send({
            from: accounts[1],
            value: web3.utils.toWei('0.1', 'ether')
        });

        await ticketSale.methods.resaleTicket(web3.utils.toWei('0.15', 'ether')).send({ from: accounts[1] });
        const resalePrice = await ticketSale.methods.resalePrices(1).call();
        assert.equal(resalePrice.toString(), web3.utils.toWei('0.15', 'ether')); // Ensure the resale price is set correctly
    });

    it("accepts resale", async () => {
        await ticketSale.methods.buyTicket(1).send({
            from: accounts[1],
            value: web3.utils.toWei('0.1', 'ether')
        });

        await ticketSale.methods.resaleTicket(web3.utils.toWei('0.15', 'ether')).send({ from: accounts[1] });
        await ticketSale.methods.acceptResale(1).send({
            from: accounts[0],
            value: web3.utils.toWei('0.15', 'ether')
        });

        const ticketsOwnedByNewOwner = await ticketSale.methods.getTicketOf(accounts[0]).call();
        assert.equal(ticketsOwnedByNewOwner.toString(), '1'); // Check that the new owner has the ticket
    });
});
