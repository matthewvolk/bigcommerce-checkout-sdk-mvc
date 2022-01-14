# Minimum Viable Checkout SDK

At it's core, Checkout SDK is pretty straightforward. This repository walks through an entire
Checkout SDK checkout session (Customer Login > Shipping > Billing > Payment) using the least amount
of Javascript code required to do so.

# Usage

1. Clone this repository
2. Install dependencies: `npm install`
3. Run the server: `npm start`
4. Follow the instructions in your terminal to serve Checkout SDK from your BigCommerce Store
5. Edit `src/checkout.js` as needed, refreshing your checkout session in your browser as you make
   and save changes

# Why?

I created this repository to help developers better understand the relationship between
[`checkout-sdk-js`](https://github.com/bigcommerce/checkout-sdk-js),
[`checkout-js`](https://github.com/bigcommerce/checkout-js/), and any other custom implementations
of `checkout-sdk-js` built by BigCommerce merchants, partners, and/or developers.

With Bigcommerce's Open Checkout, we provide
[`checkout-js`](https://github.com/bigcommerce/checkout-js/) as a React.js reference implementation
of [`checkout-sdk-js`](https://github.com/bigcommerce/checkout-sdk-js) to get developers started
building their own custom checkout UI's.

With that said, the codebase of [`checkout-js`](https://github.com/bigcommerce/checkout-js/) is
pretty intimidating at first glance. At the time of writing this README, there are a total of 1,130
individual files included in the `checkout-js` repository above.

While intimidating, this is necessary. The BigCommerce Checkout flow handles a wide variety of use
cases at each step of the flow. It's important to understand the flexibility you have with
`checkout-sdk-js`, and `checkout-js` does a great job of being an example to show you how flexible
you can be.

The key point to note is that `checkout-js` is simply a UI built on top of `checkout-sdk-js`. In
other words, `checkout-sdk-js` is responsible for all of the "backend" checkout functionality, from
logging in customers, to retrieving shipping quotes, to collecting billing information, to sending
payment information back to BigCommerce to be processed. `checkout-js` just makes it look pretty.

This repository implements a bare-bones `checkout-sdk-js` checkout flow, logging each step of
checkout to your browser's console, allowing you to visually step through the `checkout-sdk-js` flow
under the hood.

# Limitations

- Only supports guest checkout
