const Order = require("./Order");

const shwarma_cost = 10;
const pizza_cost = 10;
const youtiao_cost = 10;
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
  TOPPINGS_SELECTION: Symbol("toppings_selection"),
  TOPPINGS: Symbol("toppings"),
  SECOND_ITEM_SELECTION: Symbol("2nd_item_selection"),
  SECOND_ITEM: Symbol("2nd_item"),
  SIZE2: Symbol("size2"),
  TOPPINGS2_SELECTION: Symbol("toppings2_selection"),
  TOPPINGS2: Symbol("toppings2"),
  THIRD_ITEM: Symbol("3rd_item"),
  THIRD_ITEM_SELECTION: Symbol("3rd_item_selection"),
  SIZE3: Symbol("size3"),
  TOPPINGS3_SELECTION: Symbol("toppings3_selection"),
  TOPPINGS3: Symbol("toppings3"),
  DRINKS: Symbol("drinks"),
  FRIES: Symbol("fries"),
  PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sSize = "";
    this.sSize2 = "";
    this.sSize3 = "";
    this.sToppings = "";
    this.sToppings2 = "";
    this.sToppings3 = "";
    this.sItem = "";
    this.sItem2 = "";
    this.sItem3 = "";
    this.nOrder = 0;
    this.sDrinks = "";
    this.sFries = "";
    this.preTaxTotal = 0;
    this.nTax = 0;
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
        aReturn.push("3 for youtiao");
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
            this.sItem = "youtiao";
            this.nOrder = youtiao_cost;
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
          this.stateCur = OrderState.TOPPINGS_SELECTION;
          this.sSize = sInput;
          aReturn.push("Would you like toppings?");
        }
        break;
      case OrderState.TOPPINGS_SELECTION:
        if ((sInput.toLowerCase() != "yes") && (sInput.toLowerCase() != "no")) {
          aReturn.push("invalid input, please enter yes or no");
        } else {
          // if customer select toppings, ask which toppings they want
          if (sInput.toLowerCase() != "no") {
            aReturn.push("Please enter toppings:");
            aReturn.push("1 for cheese");
            aReturn.push("2 for garlic");
            aReturn.push("3 for basil");
            this.stateCur = OrderState.TOPPINGS;
            break;
          }
          // else go to second item question
          this.stateCur = OrderState.SECOND_ITEM_SELECTION;
          aReturn.push("Would you a second item?");
        }
        break;
      case OrderState.TOPPINGS:
        if ((sInput != "1") && (sInput != "2") && (sInput != "3")) {
          aReturn.push("Please enter 1,2 or 3");
        }
        else {
          if (sInput.toLowerCase() == "1") {
            this.sToppings = "cheese";
            this.nOrder += cheese_topping_cost;
          }
          else if (sInput.toLowerCase() == "2") {
            this.sToppings = "garlic";
            this.nOrder += other_topping_cost;
          }
          else {
            this.sToppings = "basil";
            this.nOrder += other_topping_cost;
          }
          this.stateCur = OrderState.SECOND_ITEM_SELECTION;
          aReturn.push("Would you a second item?");
        }
        break;

      case OrderState.SECOND_ITEM_SELECTION:
        if ((sInput.toLowerCase() != "yes") && (sInput.toLowerCase() != "no")) {
          aReturn.push("invalid input, please enter yes or no");
        } else {
          // if customer go for the second item
          if (sInput.toLowerCase() != "no") {
            aReturn.push("Please enter:");
            aReturn.push("1 for shawarama");
            aReturn.push("2 for pizza");
            aReturn.push("3 for youtiao");
            this.stateCur = OrderState.SECOND_ITEM;
            break;
          }
          // else go to upsell
          this.stateCur = OrderState.DRINKS;
          aReturn.push("Would you like drinks with that? If yes, Enter drink name:");
        }
        break;
      case OrderState.SECOND_ITEM:
        if ((sInput != "1") && (sInput != "2") && (sInput != "3")) {
          aReturn.push("Please enter 1,2 or 3");
        }
        else {
          if (sInput == "1") {
            this.sItem2 = "shawarama";
            this.nOrder += shwarma_cost;
          } else if (sInput == "2") {
            this.sItem2 = "pizza";
            this.nOrder += pizza_cost;
          } else if (sInput == "3") {
            this.sItem2 = "youtiao";
            this.nOrder += youtiao_cost;
          }
          this.stateCur = OrderState.SIZE2;
          aReturn.push("What size would you like?");
        }
        break;
      case OrderState.SIZE2:
        if ((sInput.toLowerCase() != "large") && (sInput.toLowerCase() != "small")) {
          aReturn.push("invalid input, please select large or small");
        } else {
          if (sInput.toLowerCase() == "large") {
            this.nOrder += large_add;
          } else {
            this.nOrder += small_add;
          }
          this.stateCur = OrderState.TOPPINGS2_SELECTION;
          this.sSize2 = sInput;
          aReturn.push("Would you like toppings?");
        }
        break;
      case OrderState.TOPPINGS2_SELECTION:
        if ((sInput.toLowerCase() != "yes") && (sInput.toLowerCase() != "no")) {
          aReturn.push("invalid input, please enter yes or no");
        } else {
          // if customer select toppings
          if (sInput.toLowerCase() != "no") {
            aReturn.push("Please enter toppings:");
            aReturn.push("1 for cheese");
            aReturn.push("2 for garlic");
            aReturn.push("3 for basil");
            this.stateCur = OrderState.TOPPINGS2;
            break;
          }
          // else go to third item question
          this.stateCur = OrderState.THIRD_ITEM_SELECTION;
          aReturn.push("Would you a third item?");
        }
        break;
      case OrderState.TOPPINGS2:
        if ((sInput != "1") && (sInput != "2") && (sInput != "3")) {
          aReturn.push("Please enter 1,2 or 3");
        }
        else {
          if (sInput.toLowerCase() == "1") {
            this.sToppings2 = "cheese";
            this.nOrder += cheese_topping_cost;
          }
          else if (sInput.toLowerCase() == "2") {
            this.sToppings2 = "garlic";
            this.nOrder += other_topping_cost;
          }
          else {
            this.sToppings2 = "basil";
            this.nOrder += other_topping_cost;
          }
          this.stateCur = OrderState.THIRD_ITEM_SELECTION;
          aReturn.push("Would you a third item?");
        }
        break;

      case OrderState.THIRD_ITEM_SELECTION:
        if ((sInput.toLowerCase() != "yes") && (sInput.toLowerCase() != "no")) {
          aReturn.push("invalid input, please enter yes or no");
        } else {
          // if customer go for the second item
          if (sInput.toLowerCase() != "no") {
            aReturn.push("Please enter:");
            aReturn.push("1 for shawarama");
            aReturn.push("2 for pizza");
            aReturn.push("3 for youtiao");
            this.stateCur = OrderState.THIRD_ITEM;
            break;
          }
          // else go to upsell
          this.stateCur = OrderState.DRINKS;
          aReturn.push("Would you like drinks with that? If yes, Enter drink name:");
        }
        break;
      case OrderState.THIRD_ITEM:
        if ((sInput != "1") && (sInput != "2") && (sInput != "3")) {
          aReturn.push("Please enter 1,2 or 3");
        }
        else {
          if (sInput == "1") {
            this.sItem3 = "shawarama";
            this.nOrder += shwarma_cost;
          } else if (sInput == "2") {
            this.sItem3 = "pizza";
            this.nOrder += pizza_cost;
          } else if (sInput == "3") {
            this.sItem3 = "youtiao";
            this.nOrder += youtiao_cost;
          }
          this.stateCur = OrderState.SIZE3;
          aReturn.push("What size would you like?");
        }
        break;
      case OrderState.SIZE3:
        if ((sInput.toLowerCase() != "large") && (sInput.toLowerCase() != "small")) {
          aReturn.push("invalid input, please select large or small");
        } else {
          if (sInput.toLowerCase() == "large") {
            this.nOrder += large_add;
          } else {
            this.nOrder += small_add;
          }
          this.stateCur = OrderState.TOPPINGS3_SELECTION;
          this.sSize3 = sInput;
          aReturn.push("Would you like toppings?");
        }
        break;

      case OrderState.TOPPINGS3_SELECTION:
        if ((sInput.toLowerCase() != "yes") && (sInput.toLowerCase() != "no")) {
          aReturn.push("invalid input, please enter yes or no");
        } else {
          // if customer select toppings
          if (sInput.toLowerCase() != "no") {
            aReturn.push("Please enter toppings:");
            aReturn.push("1 for cheese");
            aReturn.push("2 for garlic");
            aReturn.push("3 for basil");
            this.stateCur = OrderState.TOPPINGS3;
            break;
          }
          // else go to drink question
          this.stateCur = OrderState.DRINKS;
          aReturn.push("Would you like drinks with that? If yes, Enter drink name:");
        }
        break;
      case OrderState.TOPPINGS3:
        if ((sInput != "1") && (sInput != "2") && (sInput != "3")) {
          aReturn.push("Please enter 1,2 or 3");
        }
        else {
          if (sInput.toLowerCase() == "1") {
            this.sToppings3 = "cheese";
            this.nOrder += cheese_topping_cost;
          }
          else if (sInput.toLowerCase() == "2") {
            this.sToppings3 = "garlic";
            this.nOrder += other_topping_cost;
          }
          else {
            this.sToppings3 = "basil";
            this.nOrder += other_topping_cost;
          }
          this.stateCur = OrderState.DRINKS;
          aReturn.push("Would you like drinks with that? If yes, Enter drink name:");
        }
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
        this.preTaxTotal = this.nOrder;
        this.nTax = (this.nOrder * 0.13).toFixed(2);
        this.nOrder = (this.nOrder * 1.13).toFixed(2);
        aReturn.push("Thank-you for your order of");
        if (this.sToppings) {
          aReturn.push(`${this.sSize} ${this.sItem} with ${this.sToppings}`);
        } else {
          aReturn.push(`${this.sSize} ${this.sItem} with no toppings`);
        }
        if (this.sItem2) {
          if (this.sToppings2) {
            aReturn.push(`${this.sSize2} ${this.sItem2} with ${this.sToppings2}`);
          } else {
            aReturn.push(`${this.sSize2} ${this.sItem2} with no toppings`);
          }
        }
        if (this.sItem3) {
          if (this.sToppings3) {
            aReturn.push(`${this.sSize3} ${this.sItem3} with ${this.sToppings3}`);
          } else {
            aReturn.push(`${this.sSize3} ${this.sItem3} with no toppings`);
          }
        }
        if (this.sDrinks) {
          aReturn.push(`drink: ${this.sDrinks}`);
        }
        if (this.sFries) {
          aReturn.push(`fries: ${this.sFries}`);
        }
        aReturn.push(`Your order is:`);
        aReturn.push(`subtotal: $${this.preTaxTotal}`);
        aReturn.push(`tax: $${this.nTax}`);
        aReturn.push(`total: $${this.nOrder}`);
        aReturn.push(`Please pay for your order here:`);
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
          + addObj.country_code + ', '
          + addObj.postal_code;
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