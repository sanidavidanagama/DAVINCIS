document.addEventListener("DOMContentLoaded", function () {
    const offersContainer = document.getElementById("offers-container");
    const offersHeading = document.getElementById("offers-heading");
    const popup = document.getElementById("popup");
    const closePopup = document.getElementById("close-popup");
    const popupHeading = document.getElementById("popup-heading");
    const popupDescription = document.getElementById("popup-description");
    const popupPrice = document.getElementById("popup-price");
    const popupItems = document.getElementById("popup-items");
    const searchInput = document.getElementById("searchInput");
    const searchForm = document.getElementById("searchForm");

    let cartItems = [];
    let allOffers = []; // Store all offers for searching

    // Fetch the offers XML file
    fetch("../data/offers.xml")
        .then((response) => response.text())
        .then((xmlString) => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, "text/xml");

            // Category and offers
            const category = xmlDoc.querySelector("category");
            const offers = category.querySelectorAll("offer");

            // Heading
            offersHeading.textContent = category.getAttribute("name");

            // Storing for search
            allOffers = Array.from(offers);

            // Display
            displayOffers(allOffers);

            // Search 
            searchForm.addEventListener("submit", function (e) {
                e.preventDefault();
                performSearch();
            });

            searchInput.addEventListener("input", function () {
                if (this.value === "") {
                    displayOffers(allOffers);
                }
            });
        })
        .catch((error) => {
            console.error("Error loading the offers XML file:", error);
        });

    // Function to display offers
    function displayOffers(offers) {
        offersContainer.innerHTML = "";

        if (offers.length === 0) {
            const noResults = document.createElement("div");
            noResults.classList.add("no-results");
            noResults.textContent = "No offers found matching your search.";
            offersContainer.appendChild(noResults);
            return;
        }

        offers.forEach((offer) => {
            const offerName = offer.querySelector("name").textContent;

            const offerCard = document.createElement("div");
            offerCard.classList.add("offer-card");

            const offerImage = document.createElement("img");
            offerImage.src = `../assets/images/offerimages/${offerName}.png`;
            offerImage.alt = offerName;
            offerImage.title = offerName;

            offerCard.appendChild(offerImage);
            offersContainer.appendChild(offerCard);

            offerCard.addEventListener("click", () => {
                showPopup(offer, offerImage.src);
            });
        });
    }

    // Search Functionality
    function performSearch() {
        const searchInput = document.getElementById('menuSearch');
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (searchTerm === "") {
            displayOffers(allOffers);
            return;
        }

        const filteredOffers = allOffers.filter(offer => {
            const offerName = offer.querySelector("name").textContent.toLowerCase();
            const offerDescription = offer.querySelector("description").textContent.toLowerCase();

            return offerName.includes(searchTerm) ||
                offerDescription.includes(searchTerm);
        });

        displayOffers(filteredOffers);
    }

    document.getElementById('searchButton').addEventListener('click', performSearch);

    document.getElementById('menuSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Close popup when clicking the close button
    closePopup.addEventListener("click", () => {
        popup.style.display = "none";
    });

    // Close popup when clicking outside the popup content
    window.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    });

    // Function to show popup with offer details
    function showPopup(offer, offerImageSrc) {
        const offerName = offer.querySelector("name").textContent;
        const offerDescription = offer.querySelector("description").textContent;
        const offerPrice = offer.querySelector("price").textContent;
        const inclusions = offer.querySelectorAll("inclusion item");

        // Set popup content
        popupHeading.textContent = offerName;
        popupDescription.textContent = offerDescription;
        popupPrice.textContent = `Price: LKR ${offerPrice}`;

        // Clear previous items
        popupItems.innerHTML = "";

        // Fetch the menu XML file to get item details
        fetch("../data/menu.xml")
            .then((response) => response.text())
            .then((menuXmlString) => {
                const menuParser = new DOMParser();
                const menuXmlDoc = menuParser.parseFromString(menuXmlString, "text/xml");

                inclusions.forEach((inclusion) => {
                    const itemName = inclusion.textContent.trim(); 
                    const itemCategory = inclusion.getAttribute("category");

                    // Finding the item in the menu.xml
                    const categoryNode = menuXmlDoc.querySelector(`category[name="${itemCategory}"]`);
                    if (categoryNode) {
                        const menuItem = Array.from(categoryNode.querySelectorAll("item")).find(
                            (item) => item.querySelector("name").textContent.trim() === itemName
                        );

                        if (menuItem) {
                            const itemDescription = menuItem.querySelector("description").textContent;
                            const itemIngredients = menuItem.querySelector("ingredients").textContent;

                            // Creating popup item
                            const popupItem = document.createElement("div");
                            popupItem.classList.add("popup-item");

                            const itemImage = document.createElement("img");
                            itemImage.src = `../assets/images/menuimages/${itemCategory}/${itemName}.jpg`;
                            itemImage.alt = itemName;

                            const itemDetails = document.createElement("div");
                            itemDetails.classList.add("popup-item-details");

                            const itemTitle = document.createElement("h3");
                            itemTitle.textContent = itemName;

                            // Horizontal Rule
                            const hr = document.createElement("hr");
                            hr.classList.add("item-hr"); 

                            const itemDesc = document.createElement("p");
                            itemDesc.textContent = itemDescription;

                            const itemIng = document.createElement("p");
                            itemIng.textContent = `Ingredients: ${itemIngredients}`;

                            itemDetails.appendChild(itemTitle);
                            itemDetails.appendChild(hr); 
                            itemDetails.appendChild(itemDesc);
                            itemDetails.appendChild(itemIng);

                            popupItem.appendChild(itemImage);
                            popupItem.appendChild(itemDetails);

                            popupItems.appendChild(popupItem);
                        }
                    }
                });

                // Add to cart button
                const addToCartButton = document.createElement("button");
                addToCartButton.classList.add("add-to-cart");
                addToCartButton.textContent = "Add to Cart";
                addToCartButton.addEventListener("click", () => {
                    // Logic
                    const item = {
                        name: offerName,          
                        price: offerPrice,        
                        image: offerImageSrc,     
                        quantity: 1               
                    };

                    // Add the item to the cartItems array
                    cartItems.push(item);

                    alert(`${offerName} added to cart`);

                    // Saving cart to localStorage (if needed)
                    saveCartToLocalStorage();

                    // Close the popup
                    popup.style.display = "none";
                    location.reload();
                });

                popupItems.appendChild(addToCartButton);

                // Show popup
                popup.style.display = "flex";
            })
            .catch((error) => {
                console.error("Error loading the menu XML file:", error);
            });
    }

    // Function to save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    // Function to load cart from localStorage
    function loadCartFromLocalStorage() {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            cartItems = JSON.parse(storedCart);
        }
    }

    loadCartFromLocalStorage();
});


