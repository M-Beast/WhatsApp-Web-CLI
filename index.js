const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({ authStrategy: new LocalAuth() });
const ora = require('ora');
const chalk = require('chalk');
const util = require("util");

const spinner = ora('Loading...');
const wait = util.promisify(setTimeout);

//#region Console Stuff
function PrintLogo(Phone) {
    console.clear();
    console.log("\n\n");
    console.log("                                                                                                    ")
    console.log("  ░██╗░░░░░░░██╗██╗░░██╗░█████╗░████████╗░██████╗░█████╗░██████╗░██████╗░  ██████╗░░█████╗░████████╗");
    console.log("  ░██║░░██╗░░██║██║░░██║██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗  ██╔══██╗██╔══██╗╚══██╔══╝");
    console.log("  ░╚██╗████╗██╔╝███████║███████║░░░██║░░░╚█████╗░███████║██████╔╝██████╔╝  ██████╦╝██║░░██║░░░██║░░░");
    console.log("  ░░████╔═████║░██╔══██║██╔══██║░░░██║░░░░╚═══██╗██╔══██║██╔═══╝░██╔═══╝░  ██╔══██╗██║░░██║░░░██║░░░");
    console.log("  ░░╚██╔╝░╚██╔╝░██║░░██║██║░░██║░░░██║░░░██████╔╝██║░░██║██║░░░░░██║░░░░░  ██████╦╝╚█████╔╝░░░██║░░░");
    console.log("  ░░░╚═╝░░░╚═╝░░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚═════╝░╚═╝░░╚═╝╚═╝░░░░░╚═╝░░░░░  ╚═════╝░░╚════╝░░░░╚═╝░░░");
    if (!Phone) console.log("                                                                                                    ")
    else {
        console.log(chalk.blue("                                        Connected to " + Phone + "                                  "));
        console.log(chalk.blue("                                    Type help to show list of commands                              "));
    }
    console.log("\n\n");
}
//#endregion

//#region Commands Handler
async function handleCommand(input) {
    switch (input) {
        case 'help':
            console.log('List of commands:');
            console.log('- help: Show list of commands.');
            console.log('- send [number] [message]: Send a message to a contact.');
            console.log('- sendall [message]: Send a message to a contact.');
            console.log('- contacts: Show list of saved contacts.');
            console.log('- clear: Clear the console.');
            console.log('- exit: exit the program.');
            break;
        case 'clear':
            PrintLogo(client.info.wid.user);
            break;
        case 'exit':
            PrintLogo(client.info.wid.user);
            spinner.text = "Closing...";
            spinner.color = "red";
            spinner.start();
            await client.destroy();
            spinner.stop();
            process.exit(0);
        default:
            if (input.startsWith('send ')) {
                PrintLogo(client.info.wid.user);
                const args = input.split(' ');
                if (args.length >= 3) {
                    const number = args[1];
                    const message = args.slice(2).join(' ');
                    spinner.start();
                    const chat = await client.getChatById(number + '@c.us');
                    if (!chat) {
                        spinner.stop();
                        console.log(`Error occurred while sending to that contact, Please check the number and send again.`);
                    }
                    else {
                        spinner.stop();
                        chat.sendMessage(message).then((msg) => {
                            console.log(`Message sent to ${chat.name}`);
                        }).catch((err) => {
                            console.log(`Failed to send to ${chat?.name}: ${err.Message}`);
                        });
                    }
                } else {
                    console.log('Invalid usage: send [number] [message]');
                }
            } else if (input.startsWith('sendall ')) {
                PrintLogo(client.info.wid.user);
                const args = input.split(' ');
                if (args.length >= 2) {
                    const message = args.slice(1).join(' ');
                    const contacts = await client.getContacts();
                    if (contacts.length) {
                        for (const contact of contacts) {
                            if (!contact.isMyContact) continue;
                            client.sendMessage(contact.id._serialized, message).then((msg) => {
                                console.log(`Send to ${contact?.name} (${contact.number})`);
                            }).catch((err) => {
                                console.log(`Failed to send to ${contact?.name} (${contact.number}): ${err.Message}`);
                            });
                            console.log(chalk.blue("Sleeping for 5s"));
                            await wait(5000);
                        }
                    }
                    else {
                        console.log(chalk.red("No saved contacts were found!"));
                    }
                }
                else {
                    console.log('Invalid usage: sendall [message]');
                }
            } else if (input === 'contacts') {
                PrintLogo(client.info.wid.user);
                spinner.start();
                const contacts = await client.getContacts();
                spinner.stop();
                if (contacts.length) {
                    console.log('Contacts:');
                    for (const contact of contacts) {
                        if (!contact.isMyContact) continue;
                        console.log(`- ${contact.name} (${contact.number})`);
                    }
                }
                else {
                    console.log(chalk.red("No saved contacts were found!"));
                }
            } else {
                console.log("Unknown command. Type 'help' to see a list of commands.");
            }
            break;
    }
}
//#endregion

//#region Client Events
async function main() {
    PrintLogo();
    spinner.start();

    client.on('qr', qr => {
        if (spinner.isSpinning) spinner.stop();
        PrintLogo();
        console.log("Please Scan the following QR Code:");
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        if (spinner.isSpinning) spinner.stop();
        PrintLogo(client.info.wid.user);
        promptCommand();
    });

    await client.initialize();
}
//#endregion

//#region User Input Listener
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function promptCommand() {
    rl.question('Enter a command: ', async input => {
        await handleCommand(input);

        if (input !== 'exit') {
            promptCommand();
        }
    });
}
//#endregion

main();