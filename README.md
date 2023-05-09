
# WhatsApp Web CLI

This is a command-line interface (CLI) for sending WhatsApp messages using the [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library.

## Installation

1. Clone this repository: `git clone https://github.com/example-user/whatsapp-web-cli.git`
2. Install the dependencies: `npm install`

## Usage

1. Run the CLI: `node index.js` or by starting `Start.bat`
2. Scan the QR code with your WhatsApp account (only need to do this once).
3. After connecting, you will see the list of available commands.

### Commands

* `help`: Show list of commands.
* `send [number] [message]`: Send a message to a contact.
* `sendall [message]`: Send a message to all saved contacts.
* `contacts`: Show list of saved contacts.
* `clear`: Clear the console.
* `exit`: Exit the program.

## Examples

* Send a message to a contact: `send 1234567890 hello world`
* Send a message to all contacts: `sendall hello world`
* Show list of saved contacts: `contacts`

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/M-Beast/WhatsApp-Web-CLI/blob/main/LICENSE) file for details.

## Acknowledgments

* [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library
* [qrcode-terminal](https://github.com/gtanner/qrcode-terminal) library
* [ora](https://github.com/sindresorhus/ora) library

## Credits

This CLI was created by [M-Beast](https://github.com/M-Beast).
