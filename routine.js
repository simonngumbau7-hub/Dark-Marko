


/* const completed_step = JSON.parse(localStorage.getItem("step-complete"))
if (completed_step) {
    console.log(checkMarked());  
} */

    
/* ************ NAVIGATION ******************************* */
const links = document.querySelectorAll(".nav")

const screens = document.querySelectorAll(".screen")

function navigate(this_class, button){

    links.forEach( link =>{
        link.classList.remove("selected-day")
    } )

    button.classList.add("selected-day")

    screens.forEach( screen =>{
        screen.classList.remove("active")
    })
    
    document.querySelector("." + `${this_class}`).classList.add("active")

}




const morning_routine = document.querySelector(".morning--routine")
const evening_routine = document.querySelector(".evening--routine")
const week_days = document.querySelectorAll(".week-day")


const oily_concerns = {
     active_acne: "to Clear Acne in 7 days"
}



/* *********************** FETCH ROUTINE BY DAY *************************** */
let morningRoutine 
let eveningRoutine
const pdf_download = document.querySelector(".download-pdf");

/* ********************** PDF DOWNLOAD ROUTINE ******************* */


    pdf_download.addEventListener('click', () => {
            const element = document.querySelector(".week-routine")
            const mornin_div = document.querySelector(".morning-routine")
            const instruct = document.querySelectorAll(".step-instruction")
            morning_routine.classList.add("margin")
            mornin_div.classList.add("margin90")

            instruct.forEach( inst =>{
                inst.classList.add("l-height")
            })

            pdf_download.style.display = "none";

            // Options for the PDF generation
            const options = {
                margin:       0.1,
                filename:     'my_routine.pdf',
                image:        { type: 'jpeg', quality: 0.99 },
                html2canvas:  { 
                                    scale: 2,
                                    scrollY: 0, 
                                    scrollX: 0
                                },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            
            // Generate and save the PDF
            html2pdf().set(options).from(element).save();

            morning_routine.classList.remove("margin")
            mornin_div.classList.remove("margin90")

            instruct.forEach( inst =>{
                inst.classList.remove("l-height")
            })


    });



    const step_download = document.querySelector(".download-steps")

/* ************************ DOWNLOAD PDF STEP GUIDE ********************************* */
step_download.addEventListener('click', () => {
            const element = document.querySelector(".routine-steps")
    
            step_download.style.display = "none";

            // Options for the PDF generation
            const options = {
                margin:       0.65,
                filename:     'routine_steps.pdf',
                image:        { type: 'jpeg', quality: 0.99 },
                html2canvas:  { 
                                    scale: 2,
                                    scrollY: 0, 
                                    scrollX: 0
                                },
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            
            // Generate and save the PDF
            html2pdf().set(options).from(element).save();

});


        /* **************** FETCH AND DISPLAY FULL ROUTINE *********************** */
async function fetchRoutine(treatment, daybox){
    
    pdf_download.classList.add("download-active")
    
    let img_source;

    week_days.forEach( weekday => {
        weekday.classList.remove("selected-day")
    })

    daybox.classList.add("selected-day")
      
    const response = await fetch("./week-routine.json")
    const week_routine = await response.json();
    
    /* ******************** GET ROUTINE FOR THE SELECTED DAY *********************** */
    const today_routine = week_routine.filter( routine => {
       return routine.product.includes(treatment)
    })
    
   /* ********************* GET MORNING ROUTINE ************ */
    morningRoutine = today_routine.filter( routine => {
       return routine.time.includes("morning")
    })
    
   /* ********************* GET EVENING ROUTINE ************************ */
    eveningRoutine = today_routine.filter( routine => {
       return routine.time.includes("evening")
    })

    morning_routine.innerHTML = ''

    /* ******************* GET ONE PRODUCT FOR EACH CATEGORY ********************** */
    const my__type_products_unique = await routinePDF();
    

    morningRoutine.forEach( (step , index) => {

        my__type_products_unique.forEach( pro => {
            if (pro.category === step.id) {

                img_source = "tick-mark.png"

                const card = document.createElement("div");

                card.className = "step-card"

                card.innerHTML = `

                                <img src="${step.img}">
                                <div class="number-name">
                                    <div class="step-number">${index + 1 + `. `}</div>
                                    <h4 class="step-name">${step.name}</h4>
                                </div>
                                
                                

                                <div class="step-data">
                                    <p class="step-instruction">${pro.apply}</p>
                                </div>

                                 <div class="check-step" onclick="checkMarked(this)" data-id="${step.id}">
                                <img class="check-step-img" src="${img_source}">
                                </div>
                `

                morning_routine.appendChild(card)
             }
        })

    })



    evening_routine.innerHTML = ''

    eveningRoutine.forEach( (step , index) => {

        my__type_products_unique.forEach( pro => {

            if (pro.category === step.id) {

                img_source = "tick-mark.png"

                const card = document.createElement("div");

                card.className = "step-card"

                card.innerHTML = `

                                <img class="step-img" src="${step.img}">

                                <div class="number-name">
                                    <div class="step-number">${index + 1 + `. `}</div>
                                    <h4 class="step-name">${step.name}</h4>
                                </div>
                                
                                

                                <div class="step-data">

                                    <p class="step-instruction">${pro.apply}</p>
                                </div>

                                <div class="check-step" onclick="checkMarked(this)" data-id="${step.id}">
                                <img class="check-step-img" src="${img_source}">
                                </div>
                `

                evening_routine.appendChild(card)

                
             }
        })

    })

    return morningRoutine;
    
    
}






function checkMarked(div) {
    const completed = div.querySelector("img")

    if(completed.classList.contains("show")){
        completed.classList.remove("show")
    } else {
        completed.classList.add("show")
    }

    const completed_steps = [...document.querySelectorAll(".check-step-img.show")]
    
}



let sensitive_level;

const your_products = document.querySelector(".reco-products")
let skin_concern, skin_type, mySkinData;
let cleansers, serums, toners;
let my_type_products = []

async function fetchProducts(){

    const result = await fetch("./products.json")

    const products = await result.json()

    /* ********** LOAD SKIN TYPE AND SKI GOALS FROM LOCALSTORAGE */

    skin_type = "oily";
    skin_concern = "dark_marks";
    sensitive = "low";

    /* *********** FILTER PRODUCTS BY SKINTYPE */

    my_type_products = products.filter(product =>
        product.matches.some(match =>
            match.skinType === skin_type &&
            match.concern === skin_concern &&
            match.sensitivity.includes(sensitive)
        )
    );


   switch (sensitive) {
    case "low":
        sensitive_level = "Low Sensitive";
        break;
   }

   
   


 /* *********************** GET DIFERENT CATEGORIES ******************** */

   const cleansers = my_type_products.filter( product =>{
    return product.category === 'Cleanser'
   })

   const serums = my_type_products.filter( product =>{
    return product.category === 'Serum'
   })

   const moisturizers = my_type_products.filter( product =>{
    return product.category === 'Moisturizer'
   })

   const sunscreens = my_type_products.filter( product =>{
    return product.category === 'Sunscreen'
   })
   
    
   personalizedProducts(cleansers, "Cleansers")
   personalizedProducts(serums, "Serums")
   personalizedProducts(moisturizers, "Moisturizer")
   personalizedProducts(sunscreens, "Sunscreen")
  
}




let image_store = []
async function personalizedProducts(category, cat_name) {
    
    
    const category_container = document.createElement("div")
    category_container.className = "category-div"
    category_container.classList.add("gd")

    const heading = document.createElement("div")

    heading.innerHTML = `
    
         <h3 class="category-header heading" >
         For <span class="empha">${skin_type.replace("_"," ")}</span>,
         <span class="empha">${sensitive_level}</span> skin with 
         <span class="empha">${skin_concern.replace("_"," ")}</span>
         </h3>
    `

    category_container.innerHTML = `
        <h3 class="category-header m-1" >Best ${cat_name}</h3>  
    `

     category.forEach( product => {
        
        const product_card = document.createElement("div")
        product_card.className = "product-card"


        product_card.innerHTML = `

                <img id="p-image" src="" alt="">

                <div class="product-info">
                    <h4 class="product-name m-1">${product.name}</h4>
                     <p class="desc m-1">${product.desc}</p>
                    <button class="order add-product" onclick="addtoCart(this)" >Add to Cart</button>

                    <button class="order remove-product" onclick="removeFromCart(this)" >Remove</button>
                </div>


        `

        

        category_container.appendChild(product_card)

        const image_source = `${product.image}`
        image_store.push(image_source)
        
        
    }) 


    category.forEach( cat => {
        if (cat.category === "Cleanser") {
            your_products.append(heading)
        }
    })
    

    your_products.append(category_container)

    document.querySelectorAll("#p-image").forEach ( (image, index) =>{
        image.src = image_store[index]
    })   
    
}


fetchProducts();


async function fetchProducts1(){

    const result = await fetch("./products.json")

    const products = await result.json()

    /* ********** LOAD SKIN TYPE AND SKI GOALS FROM LOCALSTORAGE */

    skin_type = "oily";
    skin_concern = "dark_marks";
    sensitive = "low";

    /* *********** FILTER PRODUCTS BY SKINTYPE */

    my_type_products = products.filter(product =>
        product.matches.some(match =>
            match.skinType === skin_type &&
            match.concern === skin_concern &&
            match.sensitivity.includes(sensitive)
        )
    );

    return my_type_products;

}


async function routinePDF(){

    const my__type_products_unique = []

    const all_products = await fetchProducts1()

    const odds = [0, 2, 4, 6]

    odds.forEach( odd => {
        my__type_products_unique.push(all_products[odd])
    })

    return my__type_products_unique;

}



/* **************** FETCH PRODUCT IMAGE uRlS *************** */
async function fetchImages(params) {
    
    const all_images = await fetch("./products.json")
    const result = await all_images.json()
    const image_urls = result.map( pro => {
        return pro.image
    })

    const pro_pics = image_urls.map( url =>{
        return url.split("/")[1]
    })

    return pro_pics
    
}



const cart_items = document.querySelector(".items");
const cart_link = document.querySelector(".cart")
const cart_content = document.querySelector(".cart-content")


/* ************* ADD ITEM TO CART *********************** */

const product_sec = document.querySelector(".products")

async function addtoCart(button) {
    const product = button.parentElement;
    
    /* ****************SHOW DELETE BUTTON ************************** */
    product.querySelector(".remove-product").classList.add("show-remove")


    const product_name = product.querySelector("h4").innerHTML
    let image_path;

    pro_pics = await fetchImages()

    pro_pics.forEach( image_url =>{
        const lower_name = product_name.toLowerCase().replaceAll(" ","-")

        if (lower_name.includes(image_url.split(".")[0])) {
            image_path = image_url;  
        }
                     
    })


    


    /* ******************* CHECK IF PRODUCT IS ALREADY IN CART ******************* */
    
    const pro_in_cart = document.querySelector("." + `${image_path.split(".")[0]}` + "-div")
    if (pro_in_cart) {
       button.textContent = "Already in Cart";
       
    } else {

      
        button.textContent = "Added to Cart";
        button.classList.add("added-to-cart")

        const cart_item = document.createElement("div")
        cart_item.className = "cart-product"
        cart_item.classList.add("card", `${image_path.split(".")[0]}` + "-div") 


        /*  ******************** LOAD SHOPS ***************************** */
        const shop_has_it = []
        let price;
        const shops = await fetchBusiness()
        const prod = shops.map( shop => {
            
           return shop.products.forEach( product => {              
                if (product.name == `${image_path.split(".")[0]}`) {
                      shop_has_it.push(shop)
                      price = product.price;
                }
            })
        })


        const shops_with_it = shop_has_it;
  
        cart_item.innerHTML = `

                <div class="img-info">
                    <img class="pro-pic ${image_path.split(".")[0]}" src="">

                    <div class="name-qua">
                         <h4 class="m-1 p-name">${product_name}</h4>

                        <div class="quantity-div">
                            <label for="product-count">Quantity : </label>
                            <input type="number" class="product-quantity" onchange="quantityChange(this)" value="1" max="10" min="1">
                        </div>
                    </div>
                </div>


                 <div class="available-at">
                    <h3 class="m-1">Available at:</h3>

                    <div class="shops">

                    </div>
                </div>
        `

        cart_content.appendChild(cart_item)


        const shops_div = cart_item.querySelector(".shops")
        /* ************************ CREATE SHOPS HTML *********************** */
        shops_with_it.forEach( shop => {

            const in_stock_products = []

            shop.products.forEach( pro => {
                
                if (pro.name != `${image_path.split(".")[0]}`) {
                    in_stock_products.push(pro)
                }
            
            }) 

            const shop_div = document.createElement("div")

            shop_div.innerHTML = `
            
                        <div class="shop">
                            <h4 class="shop-name">${shop.name}, <span class="town">${shop.location}</span></h>
                            <h5>Ksh : <span class="price">${price}</span></h5>
                            <p class="exact-location">${shop.loc}</p>
                             <p class="contact">Call : <span class="p-number">${shop.call}</span></p>
                    
                            <div class="bulk-products">
                                <h5 class="order-many">Order Multiple at Once</h5>
                            </div>

                            <span class = "const-price">${price}</span>

                            <div class="total">Total Ksh : <span class="total-funds">${price}</span></div>

                            <button class="whatsapp-order" onclick="sendOrder(this, ${shop.whatsapp})" >Order on WhatsApp</button>

    
                        </div>
            
            `
            shops_div.appendChild(shop_div)


            const all_bulks = shop_div.querySelector(".bulk-products")
            
            /* ************** ORDER BULK **************** */
            in_stock_products.forEach( product => {
                const add_buk = document.createElement("div")
                add_buk.className = "add-order"
                
                const formated_name = product.name.replaceAll("-", " ")

                add_buk.innerHTML = `
                    <div class="add-order-pro" onclick="bulkOrder(this)">${product.fullName} : <span class="price-bulk">${product.price}</span>
                        <div class = "full-name">${product.fullName}</div>
                    </div>
                `

                all_bulks.appendChild(add_buk)
            })
        })



        /* ****************************** ALL IN STOCK ****************************** */


        
    }
    
    document.querySelector("."+ `${image_path.split(".")[0]}`).src = "PRODUCT-IMAGES/" + image_path;

    const items_in_cart = document.querySelectorAll(".cart-product")
    cart_items.textContent = items_in_cart.length;   
    
}



/* *************************** REMOVE PRODUCT FROM CART *********************** */
async function removeFromCart(button) {

    const pro_div = button.parentElement;

    const pro_name = button.parentElement.querySelector(".product-name").textContent
    const formated_name = pro_name.toLowerCase().replaceAll(" ", "-")
    
    const pics = await fetchImages()
    pics.forEach( url => {
        const formated_url = url.split(".")[0]

        if(formated_name.includes(formated_url)){
            
            document.querySelector("." +`${formated_url}` + "-div").remove()
            button.classList.remove("show-remove")
        };
        
    })

    const add_button = pro_div.querySelector(".add-product")
    add_button.textContent = "Add to Cart"
    add_button.classList.remove("added-to-cart")

    const items_in_cart = document.querySelectorAll(".cart-product")
    cart_items.textContent = items_in_cart.length;
    
}


/* **************************** VIEW CART ********************** */
cart_link.addEventListener( "click", ()=>{

    screens.forEach( screen =>{
        screen.classList.remove("active")
    })
    
    document.querySelector(".cart-sec").classList.add("active")
    
})


/* ********************** FETCH BUSNESSES *********************** */
async function fetchBusiness(params) {
    const response = await fetch("./shops.json")
    const shops = await response.json();
    return shops;
}


/* *********************** DETECTY QUANTITY CHANGE ********************* */


function quantityChange(input) {

    const new_quantity = Number(input.value)

    const product_c = input.parentElement.parentElement.parentElement.parentElement
    const shops = product_c.querySelectorAll(".shop")

    shops.forEach( shop => {
        const const_price = shop.querySelector(".const-price")
        const price_display = shop.querySelector(".price")

        const price_int = parseInt(const_price.textContent)        
        price_display.textContent = (price_int*new_quantity)

        const price_display_int = Number(price_display.textContent)


        /* ********** CHECK ANY ADDITIONAL PRODUCTS ******************* */
        const total_price = shop.querySelector(".total-funds")

        const any_added = document.querySelectorAll(".selected-pro")

        if (any_added.length === 0) {
            total_price.textContent = price_display.textContent
        } else {
            any_added.forEach( pro => {
                const price = Number(pro.querySelector(".price-bulk").textContent)
                const final_total = price_display_int + price
                total_price.textContent = final_total
            })
        }

    })    
}



/* ******************************* BULK ORDER ***************************** */
async function bulkOrder(product) {

    const price = product.querySelector("span").textContent
    const price_number = Number(price)
    
    const shop = product.parentElement.parentElement.parentElement;

    const total_price = shop.querySelector(".total-funds")
    let total_int = Number(total_price.textContent)


    if(product.classList.contains("selected-pro")){
        product.classList.remove("selected-pro")

        total_int = total_int - price_number;
        total_price.textContent = total_int; 

    } else {
        product.classList.add("selected-pro") 

        total_int = total_int + price_number;
        total_price.textContent = total_int; 
    }

}


function sendOrder(shop, number) {

    fbq('trackCustom', 'WhatsappOrder');
    
    const shop_div = shop.parentElement
    const shop_name = shop_div.querySelector(".shop-name").textContent

    const product_card = shop.parentElement.parentElement.parentElement.parentElement.parentElement
    const p_name = product_card.querySelector(".p-name").textContent
    const p_quantity = product_card.querySelector(".product-quantity").value
    const added_pros = [...shop_div.querySelectorAll(".selected-pro div")]
    
    const added_products = added_pros.map( added_pro =>{
        return added_pro.textContent;
    })

    
    const pro_string = added_products.toString();
    
    const message = `Hello ${shop_name}. I want ${pro_string} and ${p_quantity} ${p_name}.`


    /* ********************* WHATSAPP MESSAGE *************************** */
    const whatsapp_number = number;
    const url = `whatsapp://send?phone=${number}&text=${encodeURIComponent(message)}`
    window.open(url,"_blank")
    

}


/* ********************* CONTACT SKINPRO INC ******************* */

function contactSkinpro(params) {
    
    const bs_name = 'Skinpro Inc.'
    const my_number = "254714864161"
    const message = `Hello ${bs_name}`

    const url = `whatsapp://send?phone=${my_number}&text=${encodeURIComponent(message)}`
    window.open(url,"_blank")
    

}


    
    




