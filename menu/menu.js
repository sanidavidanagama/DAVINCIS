// Loading and Saving cart function
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cartItems');
    console.log(savedCart);
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
}

loadCartFromLocalStorage()

function saveCartToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Displaying All Menu Items
function loadMenu() {
    fetch('../data/menu.xml')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            displayMenuItems(data);
        });
}

function displayMenuItems(data) {
    let sidebar = document.getElementById("sidebar");
    let content = document.getElementById("menuContent");
    let categories = data.getElementsByTagName("category");

    Array.from(categories).forEach(category => {
        let categoryName = category.getAttribute("name");
        let section = document.createElement("div");
        section.classList.add("section");
        section.id = categoryName.toLowerCase().replace(/\s+/g, "");
        section.innerHTML = `<h2 class="content-header">${categoryName}</h2></hr>`;

        let link = document.createElement("a");
        link.href = `#${section.id}`;
        link.textContent = categoryName;
        sidebar.appendChild(link);

        let items = category.getElementsByTagName("item");
        Array.from(items).forEach(item => {
            let name = item.getElementsByTagName("name")[0]?.textContent || "Unnamed";
            let description = item.getElementsByTagName("description")[0]?.textContent || "No description";
            let price = item.getElementsByTagName("price")[0]?.textContent || "N/A";
            let ingredients = item.getElementsByTagName("ingredients")[0]?.textContent || "No Ingredients Specified";

            // Constructing image path
            let formattedCategory = categoryName.replace(/\s+/g, "").toLowerCase();
            let formattedName = name.replace(/\s+/g, "%20");
            let imagePath = `../assets/images/menuimages/${formattedCategory}/${formattedName}.jpg`;

            let menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");
            menuItem.innerHTML = `<img src="${imagePath}" alt="${name}">
                                <h3>${name}</h3>
                                <p><strong>Price: </strong>Rs. ${price}.00</p>`;
            menuItem.onclick = function () {
                showPopup(name, description, price, imagePath, ingredients);
            };
            section.appendChild(menuItem);
        });
        content.appendChild(section);
    });
}

function filterMenuItems(searchQuery) {
    const menuContent = document.getElementById('menuContent');
    const sections = menuContent.getElementsByClassName('section');

    Array.from(sections).forEach(section => {
        const items = section.getElementsByClassName('menu-item');
        let sectionHasVisibleItems = false;

        Array.from(items).forEach(item => {
            const itemName = item.getElementsByTagName('h3')[0].textContent.toLowerCase();
            if (itemName.includes(searchQuery)) {
                item.style.display = 'inline-block';
                sectionHasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Show or hide the section based on whether it has visible items
        section.style.display = sectionHasVisibleItems ? 'block' : 'none';
    });
}

function showPopup(name, description, price, imagePath, ingredients) {
    const popup = document.getElementById("popup");
    const popupImage = document.getElementById("popup-image");
    const popupName = document.getElementById("popup-name");
    const popupDescription = document.getElementById("popup-description");
    const popupPrice = document.getElementById("popup-price");
    const popupIngredients = document.getElementById("popup-ingredients");
    const closeBtn = document.querySelector(".close-btn");
    const addToCartBtn = document.getElementById("add-to-cart");

    popupImage.src = imagePath;
    popupName.textContent = name;
    popupDescription.textContent = description;
    popupPrice.textContent = price;
    popupIngredients.textContent = ingredients;

    popup.style.display = "flex";

    // Reset quantity to 1 when the popup is opened
    const quantityInput = document.querySelector('.quantity-input');
    quantityInput.value = 1; 

    closeBtn.onclick = function () {
        popup.style.display = "none";
        quantityInput.value = 1;
    };

    addToCartBtn.onclick = function () {
        const quantity = parseInt(quantityInput.value, 10);

        // Validate the quantity
        if (isNaN(quantity)) {
            alert("Invalid quantity! Please enter a valid number.");
            return;
        }

        if (quantity <= 0) {
            alert("Invalid quantity! Please enter a quantity of at least 1.");
            return;
        }

        // Create an object representing the item to be added to the cart
        const item = {
            name: name,
            price: price,
            image: imagePath,
            quantity: quantity  
        };

        // Add the item to the cartItems array
        cartItems.push(item);

        saveCartToLocalStorage();

        alert(`${quantity} ${name} added to cart!`);
        popup.style.display = "none";
        quantityInput.value = 1; 
        window.location.reload();
    };

    // Quantity controls
    const minusButton = document.querySelector('.quantity-controls .quantity-button:first-child');
    const plusButton = document.querySelector('.quantity-controls .quantity-button:last-child');

    // Remove existing event listeners
    minusButton.replaceWith(minusButton.cloneNode(true));
    plusButton.replaceWith(plusButton.cloneNode(true));

    // Get the new references to the buttons
    const newMinusButton = document.querySelector('.quantity-controls .quantity-button:first-child');
    const newPlusButton = document.querySelector('.quantity-controls .quantity-button:last-child');

    newMinusButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value, 10);
        // Stopping the item count going below 1
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    newPlusButton.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value, 10); // Parse the value as an integer
        if (!isNaN(currentValue)) { // Ensure the value is a valid number
            quantityInput.value = currentValue + 1; 
        } else {
            quantityInput.value = 1; // Reset to 1 if the value is not a number
        }
    });

    quantityInput.addEventListener('input', () => {
        let currentValue = parseInt(quantityInput.value, 10);
        if (isNaN(currentValue)) {
            quantityInput.value = 1; 
        } else if (currentValue < 1) {
            quantityInput.value = 1; 
        }
    });

    window.onclick = function (event) {
        if (event.target === popup) {
            popup.style.display = "none";
            quantityInput.value = 1; // Reset quantity to 1 when the popup is closed
        }
    };
}

// Closing Popup Menu
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}


// Sidebar Function
document.addEventListener("scroll", function () {
    let sections = document.querySelectorAll(".section");
    let sidebarLinks = document.querySelectorAll(".sidebar a");

    let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    sections.forEach(section => {
        if (section.offsetTop <= scrollPosition + 100) {
            sidebarLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href").substring(1) === section.id) {
                    link.classList.add("active");
                }
            });
        }
    });
});

// Search Function
document.getElementById('searchButton').addEventListener('click', function () {
    const searchQuery = document.getElementById('menuSearch').value.toLowerCase();
    filterMenuItems(searchQuery);
});






window.onload = loadMenu;

