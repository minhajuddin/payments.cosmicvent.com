$(function() {
  "use strict";

  //underscore template settings
  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g
  };

  var sheetURLPrefix = "https://googlesheets.zammu.in/sheet/ReAVzqzlmilw7bg7z7GnzA/",
    paymentID = window.location.hash.replace("#", "");

  //ba93b6b9-a193-45a6-bb3f-d34f7c694bff
  if (paymentID.length != 36) {
    // TODO: use sweet alert here
    alert("Invalid url");
  }

  var tmpl = _.template($("#tmpl").html())
    // get payment and render our template
  $.getJSON(sheetURLPrefix + paymentID + "?" + (new Date()).getTime(), function(resp) {
    console.log("Got", resp)

    var html = tmpl({
      payment_id: paymentID,
      short_payment_id: paymentID.split("-")[0],
      customer_name: resp.customer_name,
      amount: resp.amount,
      amount_in_paise: resp.amount * 100,
      description: resp.description,
    });

    html = $.parseHTML(html, document, true)
    $("#out").append(html)


    var rzp = new Razorpay(paymentOptionsFor(resp));

    $("#rzp").click(function(e) {
      rzp.open();
      e.preventDefault();
    });

  })

  function paymentOptionsFor(payment) {
    return {
      "key": "rzp_live_QWpjLoRplrGOaD",
      "amount": payment.amount * 100,
      "name": "Cosmicvent Software",
      "description": payment.description,
      "image": "/images/cosmicvent-logo-optimized.png",
      "handler": function(response) {
        console.log("<<>>", response.razorpay_payment_id);
      },
      "prefill": {
        "email": "payments@cosmicvent.com"
      },
      //"notes": {
      //"address": "Hello World"
      //},
      "theme": {
        "color": "#F37254"
      }
    }

  }

})
