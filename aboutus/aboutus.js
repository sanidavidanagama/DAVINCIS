// Initializing lists and variables

// Images for the slider in Our Journey Section
const slides = [
    "../assets/images/aboutus-ourjourney-slider/sliderone.png",
    "../assets/images/aboutus-ourjourney-slider/slidertwo.png",
    "../assets/images/aboutus-ourjourney-slider/sliderthree.png",
    "../assets/images/aboutus-ourjourney-slider/sliderfour.png",
    "../assets/images/aboutus-ourjourney-slider/sliderfive.png",
    "../assets/images/aboutus-ourjourney-slider/slidersix.png",
    "../assets/images/aboutus-ourjourney-slider/sliderseven.png",
    "../assets/images/aboutus-ourjourney-slider/slidereight.png" 
];

let currentIndex = 0;



// Declaring functions
function updateSlide() {
    document.getElementById("image-box").style.backgroundImage = `url(${slides[currentIndex]})`;
    document.getElementById("image-box").style.backgroundSize = "cover"; 
    document.getElementById("counter").innerText = `${currentIndex + 1}/${slides.length}`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlide();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlide();
}

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

function initMap() {
    // Specify the location coordinates
    var location = {lat: 40.7128, lng: -74.0060}; // Example: New York
    
    // Create a map centered at the location
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: location
    });
    
    // Add a marker at the location
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      title: 'Location Name'
    });
  }

updateSlide(); 
