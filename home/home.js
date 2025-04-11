// Fetching menu.xml to display the signature items.
document.addEventListener("DOMContentLoaded", function() {
    fetch('../data/menu.xml')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let content = document.getElementById("menuContent");
            let categories = data.getElementsByTagName("category");
            Array.from(categories).forEach(category => {
                if (category.getAttribute("name").toLowerCase() === "signature") {
                    let items = category.getElementsByTagName("item");
                    Array.from(items).forEach(item => {
                        let name = item.getElementsByTagName("name")[0]?.textContent || "Unnamed";
                        let description = item.getElementsByTagName("description")[0]?.textContent || "No description";
                        let price = item.getElementsByTagName("price")[0]?.textContent || "N/A";
                        let imagePath = `assets/images/menuimages/signature/${name.replace(/\s+/g, "%20")}.jpg`;

                        let card = document.createElement("div");
                        card.classList.add("menu-item");
                        card.innerHTML = `<a href="menu/menu.html#signature">
                                          <img src="${imagePath}" alt="${name}">
                                          <div class="details">
                                              <h3>${name}</h3>
                                              <p>${description}</p>
                                              <p><strong>Price:</strong> Rs. ${price}.00</p>
                                          </div>
                                          </a>`;
                        content.appendChild(card);
                    });
                }
            });
        });
});


const rightPane = document.querySelector('.right-pane');
const images = rightPane.querySelectorAll('img');
let currentImageIndex = 0;

setInterval(() => {
    // Fade out the current image
    images[currentImageIndex].classList.remove('active');
    // Move to the next image
    currentImageIndex = (currentImageIndex + 1) % images.length;
    // Fade in the next image
    images[currentImageIndex].classList.add('active');
}, 3000); 


// Access signature from xml file


function clearFields() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageTextarea = document.getElementById('message');

    if (nameInput) {
        nameInput.value = '';
    }
    if (emailInput) {
        emailInput.value = '';
    }
    if (messageTextarea) {
        messageTextarea.value = '';
    }

    alert("Are you sure you want to submit your inquiry?"); // Example alert
}


document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    let currentIndex = 1; 

    // Function to update the carousel position
    function updateCarousel() {
        const offset = -currentIndex * 33.33;
        carousel.style.transform = `translateX(${offset}%)`;

        // Highlight the active image
        items.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Dynamically updating the carousel items to create a continuous loop
        if (currentIndex === 0) {
            // If at the first image, move to the last image without animation
            carousel.style.transition = 'none';
            currentIndex = totalItems - 2;
            carousel.style.transform = `translateX(-${currentIndex * 33.33}%)`;
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease-in-out';
            }, 0);
        } else if (currentIndex === totalItems - 1) {
            // If at the last image, move to the first image without animation
            carousel.style.transition = 'none';
            currentIndex = 1;
            carousel.style.transform = `translateX(-${currentIndex * 33.33}%)`;
            setTimeout(() => {
                carousel.style.transition = 'transform 0.5s ease-in-out';
            }, 0);
        }
    }

    // Initialize the carousel
    updateCarousel();

    // Auto-advance the carousel every 3 seconds (adjust as needed)
    function autoAdvance() {
        currentIndex++;
        updateCarousel();
    }

    setInterval(autoAdvance, 3000); 
});