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
const cart =  [];

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
    });


});

