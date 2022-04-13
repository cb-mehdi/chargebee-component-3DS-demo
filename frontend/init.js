$(document).ready(function() {
  $("#loader").hide();
  $("#errors").hide();
  $("#token").hide();
  $("#customer").hide();

  // CALL BACKEND TO GET A PaymentIntent!
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", "http://localhost:4567/generatePaymentIntent?gateway=adyen&amount=1001&currency_code=EUR", false); // false for synchronous request
  xmlHttp.send( null );
  console.log(xmlHttp.responseText);
  var paymentIntent =  JSON. parse(xmlHttp.responseText);

  //var paymentIntent =   {"id":"BTLWTXSuiePhmRzG5plBADO1FCMjeEbinK6iTOCS7Lt2pjak","status":"inited","amount":15000,"gateway_account_id":"gw_199LVbSfmu8yx1","expires_at":1642371625,"payment_method_type":"card","created_at":1642369825,"modified_at":1642369825,"updated_at":1642369825,"resource_version":1642369825664,"object":"payment_intent","currency_code":"USD","gateway":"stripe"};

  $("input").on("focus", function() {
    $(this).addClass("focus");
  });

  $("input").on("blur", function() {
    $(this).removeClass("focus");
  });

  $("input").on("keyup", function() {
    if($(this).val()) {
      $(this).removeClass("empty");
      $(this).addClass("val");
    }
    else {
      $(this).addClass("empty");
      $(this).removeClass("val");
    }
  });



  var cbInstance = Chargebee.init({
    site: "mehdieurope-test",
    publishableKey: "test_5hSbupamTju5jNvelKpL7B64xvyGVmPi"
  });

  var options = {
    fonts: [
      'https://fonts.googleapis.com/css?family=Roboto:300,500,600'
    ],

    // add classes for different states
    classes: {
      focus: 'focus',
      invalid: 'invalid',
      empty: 'empty',
      complete: 'complete',
    },

    // add placeholders
    placeholder: {
      number: "4111 1111 1111 1111"
    },

    // Set locale
    locale: 'en',

    style: {

      // Styles for default state
      base: {
        color: '#333',
        fontWeight: '500',
        fontFamily: 'Roboto, Segoe UI, Helvetica Neue, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        ':focus': {
          // color: '#424770',
        },

        '::placeholder': {
          color: '#abacbe',
        },

        ':focus::placeholder': {
          // color: '#7b808c',
        },
      },

      // Styles for invalid state
      invalid: {
        color: '#E94745',

        ':focus': {
          color: '#e44d5f',
        },
        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    },
  }

  cbInstance.load("components").then(() => {

    // Create card
    var cardComponent = cbInstance.createComponent("card", options);
    // Create card fields
    cardComponent.createField("number").at("#card-number");
    cardComponent.createField("expiry").at("#card-expiry");
    cardComponent.createField("cvv").at("#card-cvc");

    // Mount card component
    cardComponent.mount();

    // Automatically focus on card fields
    cardComponent.on('ready', function() {
      cardComponent.focus();
    })

    /*let callbacks = {
      success: function(intent) {
        console.log("Success!!! PaymentIntent: " + intent);
      },

      error: function(intent, error) {
        console.log("Error!!! PaymentIntent: " + intent);
      },

      change: function(intent) {
        console.log("Change!!! PaymentIntent: " + intent);
      }
    };*/

    let callbacks;

    $("#payment").on("submit", function(event) {
      $("#payment").hide();
      $("#loader").show();
      $("#submit-button").addClass("submit");
      event.preventDefault();
      // Perform 3D Secure authorization
      cardComponent.authorizeWith3ds(paymentIntent,{firstName: "John",lastName: "Doe"}, callbacks).then(paymentIntent => {
        //alert("Success!!! PaymentIntent:" + paymentIntent);
        /// TODO send a request to backend to proceed with Customer and subscription creation.
        $("#loader").hide();
        console.log("Payment intent info: " + JSON.stringify(paymentIntent));
        $("#token").show();
        $("#token").html("Succesfully tokenized card with payment intent id: " + paymentIntent.id);
        $("#errors").hide();
        if(paymentIntent.status == "authorized"){
          // Send ajax call to create a subscription or to create a card payment source using the paymentIntent ID
          var xmlHttp = new XMLHttpRequest();
          xmlHttp.open( "GET", "http://localhost:4567/createCustomer?intentId=" + paymentIntent.id + "&customerId=demoCustomer_" + Math.floor(Math.random() * 1000000).toLocaleString('en-US', {minimumIntegerDigits: 6, useGrouping:false}), false); // false for synchronous request
          xmlHttp.send( null );
          console.log("RESULT CUSTOMER: " + xmlHttp.responseText);
          var customer =  JSON.parse(xmlHttp.responseText);
          $("#customer").show();
          $("#customer").html("Succesfully created Customer with card: <b>" + customer.customer.id + "</b>");
        }

      }).catch(error => {
        $("#loader").hide();
        $("#submit-button").removeClass("submit");
        // TODO get a proper error message
        $("#errors").show();
        $("#errors").html("Problem while tokenizing your card details\n" + error);
        $("#token").hide();
        $("#customer").hide();
        console.log(error);
      });
    });
  });
});
