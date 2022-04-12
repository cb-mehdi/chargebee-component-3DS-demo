

$(document).ready(function() {
  $("#dumbellCard").css({'border-color': 'grey', 'border-width' : 'thin'});
  $("#pullupCard").css({'border-color': 'grey', 'border-width' : 'thin'});
  $("#vipCard").css({'border-color': 'grey', 'border-width' : 'thin'});

  $("#payButtonText").css({'display': 'none'});

  //$("firstnameField").addEventListener('input', firstNameInputHandler);
});

let currency = "USD";
let planCode = "";
let amount = 0;
let paymentIntent;

function handleEmailChange(val) {
  val=val.toLowerCase();
   $("#emailText").html(val);
}

function handleFirstNameChange(val) {
   $("#firstnameText").html(val);
}

function handleLastNameChange(val) {
   $("#lastnameText").html(val);
}

function handleAddressChange(val){
  $("#addressText").html(val);
}

function handleStateChange(val){
  $("#stateText").html(val);
}

function handleCountryChange(val){
  $("#countryText").html(val);
}

function setGateway(gateway){
  $("#selectedGateway").html(gateway);

  if(amount != 0){
    // We have the gateway and the currency, lets make the create payment intent call.
    createPaymentIntent();
  }
}

function setCurrency(currencyCode){
  $("#selectedCurrency").html("<span class='fas fa-circle pe-2'></span>Currency: " + currencyCode);
  currency = currencyCode;
  if($("#selectedGateway").html() != "..." && amount != 0){
    // We have the gateway and the currency, lets make the create payment intent call.
    createPaymentIntent();
  }
}

function createPaymentIntent(){
  var selectedGateway = $("#selectedGateway").html();

  if(amount!=0 && selectedGateway!="..." && currency.length == 3){
    // CALL BACKEND TO GET A PaymentIntent!
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://localhost:4567/generatePaymentIntent?gateway=" + selectedGateway.toLowerCase() + "&amount=" + amount*100 + "&currency_code="+currency, false); // false for synchronous request
    xmlHttp.send( null );
    console.log(xmlHttp.responseText);
    paymentIntent =  JSON.parse(xmlHttp.responseText);
    console.log(paymentIntent);
    //$("#apiResponseBody").html(JSON.stringify(JSON.parse(xmlHttp.responseText), null, "\t"));
    $("#apiResponseBody").html(xmlHttp.responseText);

  }
}

function setPlan(planCode){
  $("#dumbellCard").css({'border-color': 'grey', 'border-width' : 'thin'});
  $("#pullupCard").css({'border-color': 'grey', 'border-width' : 'thin'});
  $("#vipCard").css({'border-color': 'grey', 'border-width' : 'thin'});

  if(planCode=='dumbell'){
    $("#dumbellCard").css({'border-color': '#fbc02d', 'border-width' : 'thick'});
    $("#planNameText").html('Dumbell Plan Subscription');
    $("#planPriceText").html('20 ' + currency);
    $("#planQtyText").html('1');
    $("#totalAmountText").html('20 ' + currency);
    $("#payButtonText").html("PAY 20 " + currency + "<span class='ms-3 fas fa-arrow-right'></span>");
    amount = 20;
  }
  else if(planCode=='pullup'){
    $("#pullupCard").css({'border-color': '#fbc02d', 'border-width' : 'thick'});
    $("#planNameText").html('Pull-Up Plan Subscription');
    $("#planPriceText").html('50 ' + currency);
    $("#planQtyText").html('1');
    $("#totalAmountText").html('50 ' + currency);
    $("#payButtonText").html("PAY 50 " + currency + "<span class='ms-3 fas fa-arrow-right'></span>");
    amount = 50;
  }
  else if(planCode=='vip'){
    $("#vipCard").css({'border-color': '#fbc02d', 'border-width' : 'thick'});
    $("#planNameText").html('VIP Plan Subscription');
    $("#planPriceText").html('180 ' + currency);
    $("#planQtyText").html('1');
    $("#totalAmountText").html('180 ' + currency);
    $("#payButtonText").html("PAY 180 " + currency + "<span class='ms-3 fas fa-arrow-right'></span>");
    amount = 180;
  }
}
