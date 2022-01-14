/**
 * First, we'll use the document.createElement() method to create an
 * HTML <script> element, and store it into a variable. We'll then add
 * a "src" property to the <script> element that we created and stored
 * in the variable above.
 *
 * After this step, the variable "checkoutScriptElement" would look
 * something like:
 * <script src="https://checkout-sdk.bigcommerce.com/v1/loader.js" />
 */
const checkoutScriptElement = document.createElement('script');
checkoutScriptElement.src = 'https://checkout-sdk.bigcommerce.com/v1/loader.js';

/**
 * Here, we add the "checkoutScriptElement" to the top of the DOM.
 *
 * More information:
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 */
document.head.appendChild(checkoutScriptElement);

/**
 * At this point, our DOM now has the
 * <script src="https://checkout-sdk.bigcommerce.com/v1/loader.js" />
 * tag in its "<head>", and is actively loading the Checkout SDK library
 * from BigCommerce's CDN. This is very similar to how you'd load any other
 * library such as jQuery, e.g.,
 * <script src="https://code.jquery.com/jquery-3.6.0.min.js" />
 *
 * Below, we'll pass a callback function to the checkoutScriptElement that
 * will run as soon as the entire Checkout SDK CDN library is loaded into
 * the window.
 *
 * More information:
 * https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onload
 */
checkoutScriptElement.onload = async function () {
  /**
   * These first few steps are setup + configuration. The Checkout SDK CDN
   * makes the checkoutKitLoader module available in the global browser
   * context. Here, we create the BigCommerce Checkout SDK Service and
   * store it in a variable called "service".
   *
   * More information:
   * https://github.com/bigcommerce/checkout-sdk-js#using-cdn-url
   */
  const module = await checkoutKitLoader.load('checkout-sdk');
  const service = module.createCheckoutService();

  /**
   * This step is very important. How does Checkout SDK know which checkout to
   * load? How does it know what products are in your cart?
   *
   * BigCommerce creates a variable in each checkout window containing the ID of
   * the current checkout. We retrieve the Checkout ID from this variable, and
   * give it to the Checkout SDK Service's "loadCheckout()" method. After this
   * step, the "state" variable contains the state of our Checkout ID (e.g.,
   * who is checking out, their shipping information, their billing information,
   * etc.)
   *
   * For more information, see section "Properties available on the checkout page":
   * https://developer.bigcommerce.com/stencil-docs/customizing-checkout/installing-custom-checkouts#obtaining-the-javascript-loader-file
   */
  let state = await service.loadCheckout(window.checkoutConfig.checkoutId);

  /**
   * ====================================
   * CHECKOUT STEP 1: CUSTOMER
   * ====================================
   *
   * For example purposes, we continue through checkout as a guest. But in a real
   * scenario, you would prompt the customer to log in with their account at this point.
   *
   * Alternatively, if the customer is already logged in, you can retrieve the customer
   * by calling state.data.getCustomer()
   *
   * IMPORTANT: If the customer is already signed in before proceeding to checkout, do
   * not try to continue checkout as guest. This will result in an error:
   * "UnableToContinueAsGuestError: Unable to continue as a guest because the customer
   * is already signed in."
   */
  state = await service.continueAsGuest({email: 'foo@bar.com'});

  /**
   * Here, we just log the current customer to the Javascript Console. This should be
   * the first console log that you see in your browser's console after navigating to
   * the Checkout Page.
   *
   * This should return a Customer object with ID: 0, since the customer is a guest
   */
  const yellowText = 'background-color: yellow; color: black; font-weight: bold;';
  console.log('%cCurrent Customer Checking Out:', yellowText, state.data.getCustomer());

  /**
   * ====================================
   * CHECKOUT STEP 2: SHIPPING
   * ====================================
   *
   * The "getShippingAddressFields()" method retrieves the available Shipping Address
   * Fields (including custom Address Form Fields) specific to your BigCommerce Store.
   * These can be found and modified in Advanced Settings > Account Signup Form >
   * Address Fields
   */
  const shippingInputFields = state.data.getShippingAddressFields();

  /**
   * Here, we're just logging each of the shipping address fields to the Javascript
   * console.
   */
  console.log('%cShipping Address Fields:', yellowText, shippingInputFields);

  /**
   * This object mimics the act of the customer entering their shipping information.
   * In a real scenario, each of the values below would be retrieved from user input
   * into each of the shippingInputFields from above.
   */
  const address = {
    firstName: 'Test',
    lastName: 'Tester',
    address1: '12345 Testing Way',
    city: 'Some City',
    stateOrProvinceCode: 'CA',
    postalCode: '95555',
    countryCode: 'US',
    phone: '555-555-5555',
    email: 'test.tester@test.com',
  };

  /**
   * We then pass the address object created above to the Checkout SDK's
   * 'updateShippingAddress' method to update the Checkout with the customer's
   * shipping information.
   */
  state = await service.updateShippingAddress(address);

  /**
   * Here we're just logging out the shipping address that we saved above.
   */
  console.log('%cShipping Address:', yellowText, state.data.getShippingAddress());

  /**
   * Depending on the Shipping Address above and your store's shipping settings,
   * use the getShippingOptions method below to retrieve available shipping methods for
   * the user to choose from.
   *
   * The shipping method options returned are configured in "Store Setup" > "Shipping"
   */
  const shippingOptions = state.data.getShippingOptions();
  console.log('%cAvailable Shipping Method Options:', yellowText, shippingOptions);

  /**
   * In this example, I just select the first available shipping method (in my store,
   * it's "free shipping"). In a real scenario, you would retrieve this from user input.
   */
  state = await service.selectShippingOption(shippingOptions[0].id);

  /**
   * Checkout SDK now has the user's selected Shipping Method in memory
   */
  console.log('%cSelected Shipping Option:', yellowText, state.data.getSelectedShippingOption());

  /**
   * ====================================
   * CHECKOUT STEP 3: BILLING
   * ====================================
   *
   * Update Checkout Billing Address with the same address above. In a real scenario,
   * you would retrieve this from user input.
   */
  state = await service.updateBillingAddress(address);

  /**
   * ====================================
   * CHECKOUT STEP 4: PAYMENT
   * ====================================
   *
   * At this point, Checkout SDK is now aware of:
   * 1. Who is checking out (the customer)
   * 2. Where the order is being shipped (the shipping address)
   * 3. Who to bill for the order (the billing address)
   *
   * Next, we load your store's available payment methods. The available payment method
   * options returned here are configued in "Store Setup" > "Payments".
   */
  state = await service.loadPaymentMethods();

  /**
   * Here we log the available payment methods that a customer can choose from. In a real
   * scenario, you would render each payment method option to the user so they can select
   * how they'd like to pay.
   */
  console.log('%cPayment Methods:', yellowText, state.data.getPaymentMethods());

  /**
   * Here, we initialize the payment method to be used for the order. In a real scenario,
   * this would be done after the customer selects their desired payment method.
   */
  await service.initializePayment({methodId: 'testgateway'});

  /**
   * Payment details (credit card) to be used for the order. In a real scenario, you would
   * retrieve this from user input
   */
  const payment = {
    methodId: 'testgateway',
    paymentData: {
      ccExpiry: {month: 10, year: 25},
      ccName: 'BigCommerce',
      ccNumber: '4111111111111111',
      ccType: 'visa',
      ccCvv: 123,
    },
  };

  /**
   * Finally, we go ahead and pay for the order using the information we've collcted above.
   *
   * Uncomment the three lines below if you'd like to actually place the order and redirect
   * to the Order Confirmation Page.
   */

  // state = await service.submitOrder({payment});
  // console.log(state.data.getOrder());
  // window.location.assign('/order-confirmation');
};
