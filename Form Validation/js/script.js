document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form');
    const form_items = form.querySelectorAll('input');
    
    // Event listensers
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        checkRequired(form_items);
        checkLength(form_items[0], 3, 15);
        checkLength(form_items[2], 6, 25);
        checkPasswordsMatch(form_items[2], form_items[3]);
    });
    
});

// Check passwords match
function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords do not match')
    }
}

// Check length
function checkLength(input, min, max) {
    if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less then ${max} characters`)
    }
    else if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be greater then ${min} characters`)
    }
}

// Show input error message
function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error';
    const small = formControl.querySelector('small');
    small.innerText = message;
}

// Show success outline
function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

// Check required fields
function checkRequired(inputArr) {
    inputArr.forEach(function(input) {
        if (input.value === '') {
            showError(input, `${getFieldName(input)} is required`)
        } else {
            showSuccess(input);
        };
    });
}

// Get fieldname
function getFieldName(input) {
    const id = input.id;
    return id.charAt(0).toUpperCase() + id.slice(1);
}
