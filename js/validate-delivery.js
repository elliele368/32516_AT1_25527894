// validate-delivery.js

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.querySelector("input[placeholder='Enter your name here']");
  const phoneInput = document.querySelector("input[placeholder='(04)']");
  const emailInput = document.querySelector("input[placeholder='example@gmail.com']");
  const addressInput = document.querySelector("input[placeholder='Delivery address here']");
  const stateSelect = document.querySelector("select");
  const placeOrderBtn = document.querySelector("button.uppercase");

  const touchedFields = new Set();

  function validateMobile(value) {
    return /^04\d{8}$/.test(value);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateName(value) {
    return /^[a-zA-Z\s]+$/.test(value);
  }

  function showTooltip(el, message) {
    el.setAttribute("data-tooltip", message);
    el.classList.add("tooltip-hover");
    el.parentElement.classList.add("relative");
  }

  function clearTooltip(el) {
    el.removeAttribute("data-tooltip");
    el.classList.remove("tooltip-hover");
    el.parentElement?.classList.remove("relative");
  }

  function setErrorStyle(el, isValid, message, name) {
    const value = el.value.trim();
    const shouldShowError = !isValid && value !== "" && touchedFields.has(name);

    if (shouldShowError) {
      el.classList.add("border-red-500", "bg-red-50", "tooltip-hover");
      showTooltip(el, message);
    } else {
      el.classList.remove("border-red-500", "bg-red-50", "tooltip-hover");
      clearTooltip(el);
    }
  }

  function validateForm() {
    const nameVal = nameInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const emailVal = emailInput.value.trim();
    const addressVal = addressInput.value.trim();
    const stateVal = stateSelect.value;

    const isNameValid = validateName(nameVal);
    const isPhoneValid = validateMobile(phoneVal);
    const isEmailValid = validateEmail(emailVal);
    const isAddressValid = addressVal !== "";
    const isStateValid = stateVal !== "Choose...";

    const isFormValid =
      nameVal !== "" &&
      phoneVal !== "" &&
      emailVal !== "" &&
      isNameValid &&
      isPhoneValid &&
      isEmailValid &&
      isAddressValid &&
      isStateValid;

    placeOrderBtn.disabled = !isFormValid;
    placeOrderBtn.classList.toggle("opacity-50", !isFormValid);
    placeOrderBtn.classList.toggle("cursor-not-allowed", !isFormValid);

    setErrorStyle(nameInput, isNameValid, "Only letters and spaces allowed.", "name");
    setErrorStyle(phoneInput, isPhoneValid, "Use format 04XXXXXXXX.", "phone");
    setErrorStyle(emailInput, isEmailValid, "Please include an '@' in the email address.", "email");
    setErrorStyle(addressInput, isAddressValid, "Address is required.", "address");
    setErrorStyle(stateSelect, isStateValid, "Please select a state or territory.", "state");
  }

  [
    { input: nameInput, name: "name" },
    { input: phoneInput, name: "phone" },
    { input: emailInput, name: "email" },
    { input: addressInput, name: "address" },
    { input: stateSelect, name: "state" }
  ].forEach(({ input, name }) => {
    input.addEventListener("input", () => {
      clearTooltip(input); // clear tooltip when typing

      if (input === nameInput) {
        input.value = input.value.replace(/[^a-zA-Z\s]/g, "");
      }
      if (input === phoneInput) {
        input.value = input.value.replace(/[^\d]/g, "");
      }
      validateForm();
    });

    input.addEventListener("blur", () => {
      touchedFields.add(name);
      validateForm();
    });
  });

  validateForm();
});