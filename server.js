const chalk = require('chalk');
const httpServer = require('http-server');

const {version} = require('./package.json');

const server = httpServer.createServer();

server.listen(8080, '0.0.0.0', function () {
  const y = chalk.yellow;
  const yb = chalk.yellow.bold;

  console.log(
    [
      yb(`Welcome to Minimum Viable Checkout SDK (v${version})!`),
      yb(`\nYour Checkout SDK file is available at:`),
      'http://127.0.0.1:8080/src/checkout.js',
      yb('\nInstructions:'),
      `${y('  1.')} Copy the URL above to your clipboard.`,
      `${y('  2.')} Navigate to your BigCommerce Control Panel.`,
      `${y('  3.')} In your Control Panel, navigate to "Advanced Settings" > "Checkout".`,
      `${y('  4.')} Change your "Checkout Type" to "Custom Checkout".`,
      `${y(
        '  5.'
      )} Scroll down to "Custom Checkout Settings", and enter the URL above in the "Script URL:" input field.`,
      `${y('  6.')} Click "Save" in the bottom right of your screen.`,
      `${y('  7.')} Navigate to your storefront and add a product to your cart.`,
      `${y('  8.')} Open your browser's Javascript console, and navigate to Checkout.`,
      yb('\nCommands:'),
      `${y('  CTRL + C:')} Stop Server\n`,
    ].join('\n')
  );
});

process.on('SIGINT', function () {
  process.exit();
});

process.on('SIGTERM', function () {
  process.exit();
});
