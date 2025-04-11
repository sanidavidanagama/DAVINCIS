let cartItems = [];

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartItems');
    console.log(savedCart);
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
}

// Save cart items to local storage
function saveCartToLocalStorage() {    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function showCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.style.display = 'block';
    updateCartDisplay();
}

function closeCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.style.display = 'none';
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    // Cart Header
    const headingContainer = document.createElement('div');
    headingContainer.classList.add('heading-container');

    // Cart Heading
    const heading = document.createElement('h6');
    heading.textContent = 'Your Basket';
    headingContainer.appendChild(heading);

    // Close Button
    const closeButton = document.createElement('i');
    closeButton.classList.add('fa-solid', 'fa-xmark', 'close-button');
    closeButton.onclick = closeCartPopup; // Bind the closeCartPopup function to the button's click event

    headingContainer.appendChild(closeButton);

    // Append the heading container to the cart items container
    cartItemsContainer.appendChild(headingContainer);

    // Horizontal Rule
    cartItemsContainer.appendChild(document.createElement('hr'));

    if (cartItems.length === 0) {
        // When cart is empty
        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.classList.add('empty-cart-message');
        emptyCartMessage.textContent = 'Uh! Oh! Your cart appears to be empty!';
        cartItemsContainer.appendChild(emptyCartMessage);

        const exploreMenuButton = document.createElement('button');
        exploreMenuButton.textContent = 'Explore Menu';
        exploreMenuButton.classList.add('explore-menu-button');
        exploreMenuButton.onclick = () => {
            window.location.href = '../menu/menu.html';
        };
        cartItemsContainer.appendChild(exploreMenuButton);
    } else {
        // When cart is not empty
        const scrollableContainer = document.createElement('div');
        scrollableContainer.classList.add('scrollable-cart-items');

        let subtotal = 0;

        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            // Item Image
            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemElement.appendChild(itemImage);

            // Item Details Container (Name, Quantity Controls, Price)
            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');

            // Item Name 
            const itemName = document.createElement('div');
            itemName.classList.add('item-name');
            itemName.textContent = item.name;
            itemDetails.appendChild(itemName);

            // Quantity Controls and Price
            const quantityAndPrice = document.createElement('div');
            quantityAndPrice.classList.add('quantity-and-price');

            // Quantity Controls
            const quantityControls = document.createElement('div');
            quantityControls.classList.add('quantity-controls-popup');

            const minusButton = document.createElement('button');
            
            // Minus button process
            if (item.quantity === 1) {
                // Showing the trash icon when quantity is 1
                const trashIcon = document.createElement('i');
                trashIcon.classList.add('fa-solid', 'fa-trash');
                minusButton.appendChild(trashIcon);

                minusButton.appendChild(document.createTextNode('\u200B'));
                minusButton.appendChild(trashIcon);

                // Removing the item when the trash icon is clicked
                minusButton.onclick = () => removeItemFromCart(index);

            } else {
                // Displaying the minus sign when quantity is greater than 1
                minusButton.textContent = '-';

                // Decreasing the quantity when the minus button is clicked
                minusButton.onclick = () => adjustQuantity(index, -1);
            }

            quantityControls.appendChild(minusButton);
            
            // Setting the input field in quantity controls
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.setAttribute('aria-label', 'Quantity Input')
            quantityInput.value = item.quantity;
            quantityInput.onchange = (e) => setQuantity(index, parseInt(e.target.value));
            quantityControls.appendChild(quantityInput);

            const plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.onclick = () => adjustQuantity(index, 1);
            quantityControls.appendChild(plusButton);

            quantityAndPrice.appendChild(quantityControls);

            // Item Price
            const itemPrice = document.createElement('div');
            itemPrice.classList.add('item-price');
            itemPrice.textContent = `Rs. ${item.price * item.quantity}.00`;
            quantityAndPrice.appendChild(itemPrice);

            itemDetails.appendChild(quantityAndPrice);
            itemElement.appendChild(itemDetails);

            scrollableContainer.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        // Appending the scrollable container containing all cart items to the cart items container
        cartItemsContainer.appendChild(scrollableContainer);

        const tax = subtotal * 0.18;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = `Rs. ${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `Rs. ${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `Rs. ${total.toFixed(2)}`;
    }
}

function updateCartCount() {
    // Helper function to update cart count span
    const cartCountElement = document.querySelector('.cart-count');
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    if (totalItems > 0) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = 'flex';
    } else {
        cartCountElement.style.display = 'none';
    }
}

function addItemToCart(name, price, image) {
    // Function to add items to cart list
    cartItems.push({ name, price, image, quantity: 1 });
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
}

function adjustQuantity(index, change) {
    cartItems[index].quantity = Math.max(1, cartItems[index].quantity + change);
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
}

function setQuantity(index, quantity) {
    cartItems[index].quantity = Math.max(1, quantity);
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
}

function removeItemFromCart(index) {
    cartItems.splice(index, 1); 
    updateCartDisplay();
    updateCartCount();
    saveCartToLocalStorage();
    location.reload();
}


function viewMore() {
    window.location.href = '../menu/menu.html'; 
}

function checkout() {
    if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.")
    }
    else {
        window.location.href = '../checkout/checkout.html';
    }
}


// Loading the cart when the page loads
window.addEventListener('load', function() {
    loadCartFromLocalStorage();
    updateCartDisplay();
    updateCartCount();
});



