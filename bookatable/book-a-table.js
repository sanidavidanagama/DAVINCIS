// Initializing functions

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function roundTime(input) {
    let time = input.value;
    if (!time) return;

    let [hours, minutes] = time.split(":").map(Number);

    // Rounding minutes to the nearest 15-minute increment
    minutes = Math.ceil(minutes / 15) * 15;

    // Adjusting the time overflow
    if (minutes === 60) {
        minutes = 0;
        hours = (hours + 1) % 24;
    }

    // Formatting the time as HH:MM
    let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // Updating the input field with the rounded time
    input.value = formattedTime;
}

function validateForm() {
    // Validating fields in form
    const firstName = document.querySelector('input[placeholder="First Name"]').value.trim();
    const lastName = document.querySelector('input[placeholder="Last Name"]').value.trim();
    const email = document.querySelector('input[type="email"]').value.trim();
    const contactNumber = document.querySelector('input[placeholder="Contact Number"]').value.trim();
    const date = document.getElementById('Date').value;
    const time = document.getElementById('time').value;
    const numberOfGuests = document.querySelector('input[type="number"]').value;
    const termsChecked = document.getElementById('check').checked;

    if (!firstName) {
        alert('Please enter your First Name');
        return false;
    }

    if (!lastName) {
        alert('Please enter your Last Name');
        return false;
    }

    if (!email) {
        alert('Please enter your Email');
        return false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        alert('Please enter a valid Email address');
        return false;
    }

    if (!contactNumber) {
        alert('Please enter your Contact Number');
        return false;
    }

    if (!date) {
        alert('Please select a Date');
        return false;
    }

    if (!time) {
        alert('Please select a Time');
        return false;
    } else {
        // Validating time between 10am and 9pm
        const [hours, minutes] = time.split(':').map(Number);
        if (hours < 10 || (hours >= 21 && minutes > 0)) {
            alert('Reservation time must be between 10:00 AM and 9:00 PM');
            return false;
        }
    }

    if (!numberOfGuests) {
        alert('Please enter Number of Guests');
        return false;
    } else if (numberOfGuests < 1) {
        alert('Number of Guests must be at least 1');
        return false;
    } else if (numberOfGuests > 20) {
        alert('Maximum number of guests is 20');
        return false;
    }

    if (!termsChecked) {
        alert('Please accept the terms and conditions');
        return false;
    }

    // If all validations pass redirecting to success page
    document.querySelector('form').submit();
    window.location.href = 'book-a-table-thank-you.html';
    return true;
}

document.querySelector('.reserve-button').addEventListener('click', function (e) {
    e.preventDefault();
    validateForm();
});


document.getElementById("terms-link").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("popup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
});


// Date Validation
const dateInput = document.getElementById('Date');
const today = new Date();
const maxDate = new Date();

// Setting minimum date to today
const todayFormatted = today.toISOString().split('T')[0];
dateInput.min = todayFormatted;

// Set maximum date to 4 years from today
maxDate.setFullYear(today.getFullYear() + 4);
const maxDateFormatted = maxDate.toISOString().split('T')[0];
dateInput.max = maxDateFormatted;
