//selecting the cart button
const cartBtn =  document.querySelector('.cart-btn');/*1*/
const closeCartBtn =  document.querySelector('.close-cart');/*2*/
const clearCartBtn =  document.querySelector('.clear-btn');/*3*/
const cartDOM =  document.querySelector('.cart');/*4*/
const cartOverlay =  document.querySelector('.cart-overlay');/*5*/
const cartItems =  document.querySelector('.cart-items');/*6*/
const cartTotal =  document.querySelector('.cart-total');/*7*/
const cartContent =  document.querySelector('.cart-content');/*8*/
const productDoM =  document.querySelector('.products-center');/*9*/


//10. CART: This will be our main cart.Where we will be placing information.Getting information from localStorage
let cart =  [];

//buttons
let buttonsDOM =[];

//11. creating classes and methods. Will be responsible for getting the products locally.
class Products{

    /*method to get the product
    *
    *
    * */

   async getProducts(){
        //using fetch method. With this feature we can use Async-wait(this will always return a promise) .
        // We can also use (await)-this will allow us to wait till the (promise) is settled then we return a result

       try{
           let result;
           result = await fetch('products.json');
           let data;
           data = await result.json();
           /*return  data;*/
           //now,knowing that the data returns the object as above (return data), I will pass the property (items) which is the name of the json data object
           let products = data.items; //products is holding the array of product items
           //will use the map method (map()) since I have an array of product instead arrange the json properly
           products = products.map(item => {
               let fields = item.fields;
               const {title,price} = fields;
               const{id} = item.sys;
               const image = item.fields.image.fields.file.url;
               return{title,price,id,image}
           })
           return products;



       }catch(error){
           console.log(error)
       }





    }

    get(){

    }



}


//12. UI Class to Display the product. It will get the items been returned from product class or getting them from localStorage
class UI {

    /*1. Overview so far
    * 1. I am geeting the product information from the COMContentLoaded EvenListener through the products.getProduct()...
    * 2.Then I used the UI display product method where I get an array
    * 3. Then I loop over this array for each and every item in the array and add this to the result variable as a string, and keep on adding and overriding
    * 4. At the end I set the property on a productDom.
    * */
      //this method will get an array
      displayProducts(products){
          //console.log(products)
          let result = '';
          products.forEach(product => {//forEach and every product get the ff properties
              result += `
                 <article class="product">
                                <div class="img-container">
                                    <img src="${product.image}" class="product-img">
                                    <button class="bag-btn" data-id=${product.id}>
                                        <i class="fas fa-shopping-cart"></i>
                                        Keep in Basket
                                    </button>
                                </div>

                                 <h3>${product.title}</h3>
                                 <!--<h4>GHC 50</h4>-->
                                 <h4>GHC ${product.price}</h4>
                         </article>`;
          });

          productDoM.innerHTML=result;
      };
  //After displaying the product let get the buttons
    getBagButtons(){
       /*spread operator used here*/
        const buttons = [...document.querySelectorAll(".bag-btn")];

        buttonsDOM = buttons;
        /*console.log(btns);*/
        /*now using the dataset to get ID of each item*/
        buttons.forEach(button =>{
            let id = button.dataset.id; //get the ID
            //console.log(id);
            /*cart is an array .Using the find method I will have on the arrays and find me that Item if it is in the cart. Whatever item that is in the cart
            * get me a callback function and within the function I pass the argument with the item that if the item ID matches with the id that I have in buttons then something must happen
            * If the item will be in cart then, I want to do two things
            * */
            let inCart = cart.find(item=> item.id === id);
            if (inCart){
                button.innerHTML = "Cart Captured";
                button.disabled = true;
            }else{

                /*
                * 1. we get Cart Item from products
                * 2. We added that cart item through cart array that I had
                * 3. Using the the Storage to save the cart in the storage
                * */
                button.addEventListener('click', (e) =>{
                    e.target.innerText = "Cart Captured";
                    e.target.disabled = true;
                    //get product from products based on the ID
                    let cartItem = {...Storage.getProduct(id), amount: 1}; //using destructor through spread operator.making the array in a method. asking spread spread operator to get all the properties and values.
                    //console.log(cartItem)


                    //ADD product to the cart
                    cart = [...cart, cartItem ]
                    //console.log(cart)

                    //save cart in local storage
                        Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart)
                    //display cart items
                    this.addCartItem(cartItem);
                    //show the cart

                })
            }

        })

    }
    setCartValues(cart){
       let tempTotal = 0;
       let itemsTotal =0;
       cart.map(item=> {
           tempTotal += item.price * item.amount;
           itemsTotal += item.amount;
       })
        cartTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
       cartItems.innerHTML = itemsTotal;
       //console.log(cartTotal,cartItems)

    }

    //getting item dynamically
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
       
         <!--<img src="./images/fruit1.jpg" alt="product">-->
         <img src="${item.image}" alt="product">
                                <div>
                                    <!--<h4>Carrot</h4>-->
                                    <h4>${item.title}</h4>
                                    <!--<h5>GHC 50</h5>-->
                                    <h5>GHC ${item.price}</h5>
                                    <span class="remove-item">remove</span>
                                </div>
                                <div>
                                    <i class="fas fa-chevron-up" style="font-size:24px;color:black"></i>
                                    <p class="item-amount">1</p>
                                    <i class="fas fa-chevron-down" style="font-size:24px;color:black"></i>

                                </div>
       
       `;
    }
}

//13. Actual localStorage Class
class Storage{

    /*1. Overview so far
   * a. we set our entire product up to load in localStorage by creating a static method
   * b. we stored by calling the METHOD in the event listener
   *
   * */


    //creating a static method so we can use it without instantiating the class
    /* 1. passing my products array to the method which is a parameter
    * 2. Access the localStorage and setItem to be stored in it. Parse it as a string by giving it a Property name and the products to be stored
    *
    * */
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }


      static getProduct(id){//id gotten from button

        let products = JSON.parse(localStorage.getItem('products'));//will return an array from local storage
          return products.find(product => product.id === id);

      }

      static saveCart(){
        localStorage.setItem('cart', JSON.stringify(cart));
      }
}


/*14.Event Listener
* The evenListener is given the name DOMContentLoaded.So when the content loads, we call the callBackFunction
* using the arrow function syntax ()=>{}, where we will be calling our function
* Will class instances of the classes in the call back function
* Storage class wont have instance in the callBackFunction because will use static methods in that class.
*
*  */

document.addEventListener("DOMContentLoaded", () =>{
    const ui = new UI();
    const products = new Products();

    //get all products using an ajax call.
    /*Get the product which is my instance and the method. And pass the then() method to console.log whatever i'm getting*/
    /*products.getProducts().then(data => console.log(data))*/
    /*products.getProducts().then(products => console.log(products));*/
   /* products.getProducts().then(products =>ui.displayProducts(products));
    Storage.saveProducts(Products);*/

    products.getProducts().then( products => {

        ui.displayProducts(products)
        Storage.saveProducts(products);
    }).then(()=> {//this means run the then() when i'm done running the display product

        ui.getBagButtons();

    });


});

