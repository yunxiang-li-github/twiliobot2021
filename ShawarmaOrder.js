const Order = require("./Order");

const shwarma_cost = 10;
const pizza_cost = 10;
const wrap_cost = 10;
const small_add = 5;
const large_add = 10;
const cheese_topping_cost = 2;
const other_topping_cost = 3;
const drink_cost = 3;
const fries_cost = 3;

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  FIRST_ITEM: Symbol("1st item"),
  SIZE: Symbol("size"),
  TOPPINGS: Symbol("toppings"),
  DRINKS: Symbol("drinks"),
  FRIES: Symbol("fries"),
  PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sToppings = "";
    this.sDrinks = "";
    this.sFries = "";
    this.sItem = "";
    this.nOrder = 0;
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.FIRST_ITEM;
        aReturn.push("Welcome to Yunxiang's Restaurant.");
        aReturn.push("Please enter:");
        aReturn.push("1 for shawarama");
        aReturn.push("2 for pizza");
        aReturn.push("3 for wrap");
        break;
      case OrderState.FIRST_ITEM:
        if ((sInput != "1") && (sInput != "2") && (sInput != "3")) {
          aReturn.push("Please enter 1,2 or 3");
        }
        else {
          if (sInput == "1") {
            this.sItem = "shawarama";
            this.nOrder = shwarma_cost;
          } else if (sInput == "2") {
            this.sItem = "pizza";
            this.nOrder = pizza_cost;
          } else if (sInput == "3") {
            this.sItem = "wrap";
            this.nOrder = wrap_cost;
          }
          this.stateCur = OrderState.SIZE;
          aReturn.push("What size do you like?");
        }
        break;
      case OrderState.SIZE:
        if ((sInput.toLowerCase() != "large") && (sInput.toLowerCase() != "small")) {
          aReturn.push("invalid input, please select large or small");
        } else {
          if (sInput.toLowerCase() == "large") {
            this.nOrder += large_add;
          } else {
            this.nOrder += small_add;
          }
          this.stateCur = OrderState.TOPPINGS;
          this.sSize = sInput;
          aReturn.push("What toppings would you like?");
        }
        break;
      case OrderState.TOPPINGS:
        if (this.sToppings.toLowerCase() == "cheese") {
          this.nOrder += cheese_topping_cost;
        }
        else {
          this.nOrder += other_topping_cost;
        }
        this.stateCur = OrderState.DRINKS;
        this.sToppings = sInput;
        aReturn.push("Would you like drinks with that? If yes, Enter drink name:");
        break;
      case OrderState.DRINKS:
        if (sInput.toLowerCase() != "no") {
          this.sDrinks = sInput;
          this.nOrder += drink_cost;
        }
        this.stateCur = OrderState.FRIES;
        aReturn.push("Would you like fries with that?");
        break;
      case OrderState.FRIES:
        if (sInput.toLowerCase() != "no") {
          this.sFries = sInput;
          this.nOrder += fries_cost;
        }
        this.stateCur = OrderState.PAYMENT;
        this.nOrder = (this.nOrder * 1.13).toFixed(2);
        aReturn.push("Thank-you for your order of");
        aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
        if (this.sDrinks) {
          aReturn.push(`drink: ${this.sDrinks}`);
        }
        if (this.sFries) {
          aReturn.push(`fries: ${this.sFries}`);
        }
        aReturn.push(`Please pay for your order here`);
        aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
        break;
      case OrderState.PAYMENT:
        this.isDone(true);
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
        // get the delivery address
        // console.log(sInput.purchase_units[0]);
        let addObj = sInput.purchase_units[0].shipping.address;
        let address = addObj.address_line_1 + ', '
                      + addObj.admin_area_2 + ', '
                      + addObj.admin_area_1 + ', '
                      + addObj.postal_code
        aReturn.push(`Your order will be delivered to ${address}`);
        break;
    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
    return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

  }
}