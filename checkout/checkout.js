// Initializing functions 

function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');

    let subtotal = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty.</div>';
    } else {
        cartItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');

            // Item image
            const itemImage = document.createElement('img');
            itemImage.src = item.image;
            itemImage.alt = item.name;
            itemElement.appendChild(itemImage);

            // Item details
            const itemDetails = document.createElement('div');
            itemDetails.classList.add('item-details');

            // Item name
            const itemName = document.createElement('div');
            itemName.classList.add('item-name');
            itemName.textContent = item.name;
            itemDetails.appendChild(itemName);

            // Quantity and price
            const quantityAndPrice = document.createElement('div');
            quantityAndPrice.classList.add('quantity-and-price');

            // Item price
            const itemPrice = document.createElement('div');
            itemPrice.classList.add('item-price');
            itemPrice.textContent = `Rs. ${item.price * item.quantity}.00`;
            quantityAndPrice.appendChild(itemPrice);

            // Quantity controls
            const quantityControls = document.createElement('div');
            quantityControls.classList.add('quantity-controls-popup');

            // Minus button
            const minusButton = document.createElement('button');
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

            // Quantity input
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = item.quantity;
            quantityInput.setAttribute('aria-label', 'quantity-input')
            quantityInput.onchange = (e) => setQuantity(index, parseInt(e.target.value));
            quantityControls.appendChild(quantityInput);

            // Plus button
            const plusButton = document.createElement('button');
            plusButton.textContent = '+';
            plusButton.onclick = () => adjustQuantity(index, 1);
            quantityControls.appendChild(plusButton);

            quantityAndPrice.appendChild(quantityControls);
            itemDetails.appendChild(quantityAndPrice);
            itemElement.appendChild(itemDetails);
            cartItemsContainer.appendChild(itemElement);

            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.18;
        const delivery = 500;
        const total = subtotal + tax + delivery;
        const hr = document.createElement('hr');
        hr.classList.add('hr2');
        cartItemsContainer.appendChild(hr);
        subtotalElement.textContent = `Rs. ${subtotal.toFixed(2)}`;
        taxElement.textContent = `Rs. ${tax.toFixed(2)}`;
        deliveryElement.textContent = `Rs. ${delivery.toFixed(2)}`;
        totalElement.textContent = `Rs. ${total.toFixed(2)}`;
    }
}

function adjustQuantity(index, change) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems[index].quantity += change;
    if (cartItems[index].quantity < 1) cartItems[index].quantity = 1;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    location.reload();
}

function setQuantity(index, quantity) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (quantity < 1) quantity = 1;
    cartItems[index].quantity = quantity;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    location.reload();
}

function removeItemFromCart(index) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    location.reload();
}

function togglePaymentDetails(show) {
    const cardDetails = document.getElementById('cardDetails');
    if (show) {
        cardDetails.classList.remove('hidden');
    } else {
        cardDetails.classList.add('hidden');
    }
}

function formatCardNumber(input) {
    let cardNumber = input.value.replace(/\D/g, '');
    cardNumber = cardNumber.substring(0, 16);
    cardNumber = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    input.value = cardNumber;
}

function formatCVV(input) {
    let cvvNumber = input.value.replace(/\D/g, '');
    cvvNumber = cvvNumber.substring(0, 3);    
    input.value = cvvNumber;
}

function formatMonthYear(input) {
    let monthYear = input.value.replace(/\D/g, '');
    monthYear = monthYear.substring(0, 4);
    monthYear = monthYear.replace(/(\d{2})(?=\d)/g, '$1/');
    input.value = monthYear;
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function validateForm() {
    // Validating form
    const firstName = document.querySelector('input[placeholder="First Name"]').value.trim();
    const lastName = document.querySelector('input[placeholder="Last Name"]').value.trim();
    const email = document.querySelector('input[placeholder="Email"]').value.trim();
    const contactNumber = document.querySelector('input[placeholder="Contact Number"]').value.trim();
    const houseNumber = document.querySelector('input[placeholder="House Number"]').value.trim();
    const street = document.querySelector('input[placeholder="Street"]').value.trim();
    const townCity = document.querySelector('input[placeholder="Town/City"]').value.trim();
    const province = document.querySelector('input[placeholder="Province"]').value.trim();
    const isCardPayment = document.getElementById('card').checked;
    const termsChecked = document.getElementById('check').checked;
    
    if (!firstName) {
        alert("Please enter your First Name");
        return false;
    }
    
    if (!lastName) {
        alert("Please enter your Last Name");
        return false;
    }
    
    if (!email) {
        alert("Please enter your Email");
        return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid Email address");
        return false;
    }
    
    if (!contactNumber) {
        alert("Please enter your Contact Number");
        return false;
    }
    
    if (!houseNumber) {
        alert("Please enter your House Number");
        return false;
    }
    
    if (!street) {
        alert("Please enter your Street");
        return false;
    }
    
    if (!townCity) {
        alert("Please enter your Town/City");
        return false;
    }
    
    if (!province) {
        alert("Please enter your Province");
        return false;
    }
    
    // Checking if payment method is selected
    if (!document.getElementById('cod').checked && !document.getElementById('card').checked) {
        alert("Please select a payment method");
        return false;
    }
    
    // Validate card details if card payment is selected
    if (isCardPayment) {
        const cardNumber = document.querySelector('input[placeholder="Card Number"]').value.trim();
        const expiration = document.getElementById('monthYearInput').value.trim();
        const cvv = document.querySelector('input[placeholder="CVV"]').value.trim();
        const cardholderName = document.querySelector('input[placeholder="Cardholders Name"]').value.trim();
        
        if (!cardNumber) {
            alert("Please enter your Card Number");
            return false;
        } else if (cardNumber.replace(/\s/g, '').length !== 16) {
            alert("Card Number must be 16 digits");
            return false;
        }
        
        if (!expiration) {
            alert("Please enter the Expiration date (MM/YY)");
            return false;
        } else if (!/^(0[1-9]|1[0-2])\/([2-9][5-9]|[3-9][0-9])$/.test(expiration)) {
            alert("Please enter a valid Expiration date in MM/YY format");
            return false;
        }
        
        if (!cvv) {
            alert("Please enter the CVV");
            return false;
        } else if (cvv.length !== 3) {
            alert("CVV must be 3 digits");
            return false;
        }
        
        if (!cardholderName) {
            alert("Please enter the Cardholder's Name");
            return false;
        }
    }
    
    // Check if terms are accepted
    if (!termsChecked) {
        alert("Please accept the terms and conditions");
        return false;
    }
    else {
        // Clear the cart from localStorage and memory
        localStorage.removeItem('cartItems');
        cartItems = []; 
        
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        
        // Redirect to confirmation page
        window.location.href = 'checkout-thank-you.html';
        return true;
    }
    
}



// Attaching the validation function to the checkout button
document.querySelector('.checkout-button').addEventListener('click', validateForm);

document.addEventListener('DOMContentLoaded', function() {
    // Loading cart items on load
    loadCartItems();
});

document.getElementById("terms-link").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
});