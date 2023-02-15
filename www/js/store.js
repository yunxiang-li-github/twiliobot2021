import "https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.12/js/framework7.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js"
// Your web app's Firebase configuration
import firebaseConfig from "./firebase.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);



// firebase.database().ref('todos/').on("value", snapshot => {
//     $$("#todo_list").html("");
//     let oTodos = snapshot.val();
//     console.log(oTodos);
//     Object.keys(oTodos).map((key) => {
//         const oTodo = oTodos[key];
//         console.log(oTodo);
//         $$("#todo_list").prepend(`<div>${oTodo.name}</div>`);
//     });
// });


window.StoreData = (oOrder) => {
    console.log("I made it here");
    const orderID = new Date().toISOString().replace(".", "_");
    firebase.database().ref('orders/' + orderID).set(oOrder).then(
        () => {
            // alert("Hi, how many I help you");
            window.open("", "_self");
            window.close();
            $$("#orders_item").val("");
        }).catch(e => {
            console.log(e.toString());
        });
}