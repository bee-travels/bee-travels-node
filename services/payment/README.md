# Bee Travels Payment Service - Node.js

The Payment service is a microservice designed to manage Payments for the Bee Travels travel application.  

It showcases a Modern JavaScript application that has a `plugin` architecture to cater to swapping out of 2 important aspects of this microservice's logic.

We include a `plugin` Strategy Pattern for:
1. **The Bootstrap ping-pong payment processor**
> Simple payment responder will validate and `fake` a credit card payment

1. **Future bridge example to Stripe stub ( or to say Shopify, PayPal etc**
 
 Plugins are set via an Enviroment Varialbe  called `PAYMENT_PROVIDER`

 This is set by running a terminal window and typing:

 ```sh
# For the default simulator/responder ( no charges will be made )
 export PAYMENT_PROVIDER=PINGPONG

 # For the STRIPE strategy stub to be called
 export PAYMENT_PROVIDER=STRIPE

 ```

 In this manner the strategy `plugin` will load and behave as the strategy algorithm is setup.

 To extend the payment service to allow for other various services ( e.g. Shopify or PayPal )
pleae follow the methodology as seen by the code in the paymentStrategyManager.js [here](https://github.com/bee-travels/bee-travels-node/blob/really-the-payment-service/services/payment/src/strategies/paymentStrategyManager.js#L5-L23)






## How to Run

* [Local with no containers](#local-with-no-containers)

### Local with no containers



#### Steps

```sh
git clone https://github.com/bee-travels/bee-travels-node
cd bee-travels-node

#installation
yarn install

#run unittests
yarn workspace payment run test

#run production
yarn workspace payment run start

```

Then simply navigate to
http://localhost:9403 and test out this microservice API endpoints using the Swagger test harness page.

