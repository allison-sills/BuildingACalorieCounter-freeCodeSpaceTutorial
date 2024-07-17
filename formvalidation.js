// Get references to DOM elements
const calorieCounter = document.getElementById('calorie-counter'); // The form element for the calorie counter
const budgetNumberInput = document.getElementById('budget'); // Input element for the calorie budget
const entryDropdown = document.getElementById('entry-dropdown'); // Dropdown element to select entry type (breakfast, lunch, etc.)
const addEntryButton = document.getElementById('add-entry'); // Button to add a new entry
const clearButton = document.getElementById('clear'); // Button to clear the form
const output = document.getElementById('output'); // Element to display the result
let isError = false; // Flag to track if there is an error

// Function to clean input string by removing certain characters
function cleanInputString(str) {
  const regex = /[+-\s]/g; // Regular expression to match +, -, and whitespace characters
  return str.replace(regex, ''); // Replace matched characters with an empty string
}

// Function to check if the input string is invalid
function isInvalidInput(str) {
  const regex = /\d+e\d+/i; // Regular expression to match scientific notation
  return str.match(regex); // Return the match if found, otherwise null
}

// Function to add a new entry input field
function addEntry() {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`); // Get the target container based on dropdown value
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1; // Calculate the new entry number
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`; // HTML string for new entry
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString); // Insert the new entry HTML into the target container
}

// Function to calculate total calories
function calculateCalories(e) {
  e.preventDefault(); // Prevent the default form submission
  isError = false; // Reset the error flag

  // Get all number input elements for each meal and exercise
  const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');

  // Calculate total calories for each category
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  if (isError) {
    return; // If there is an error, exit the function
  }

  // Calculate consumed and remaining calories
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit'; // Determine if there is a surplus or deficit
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `; // Update the output HTML

  output.classList.remove('hide'); // Show the output element
}

// Function to get total calories from a list of input elements
function getCaloriesFromInputs(list) {
  let calories = 0;

  for (const item of list) {
    const currVal = cleanInputString(item.value); // Clean the input value
    const invalidInputMatch = isInvalidInput(currVal); // Check if the input is invalid

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`); // Alert the user if there is an invalid input
      isError = true; // Set the error flag
      return null; // Exit the function
    }
    calories += Number(currVal); // Add the current value to the total calories
  }
  return calories; // Return the total calories
}

// Function to clear the form
function clearForm() {
  const inputContainers = Array.from(document.querySelectorAll('.input-container')); // Get all input containers

  for (const container of inputContainers) {
    container.innerHTML = ''; // Clear the inner HTML of each container
  }

  budgetNumberInput.value = ''; // Clear the budget input value
  output.innerText = ''; // Clear the output text
  output.classList.add('hide'); // Hide the output element
}

// Add event listeners to buttons and form
addEntryButton.addEventListener("click", addEntry); // Add event listener to the "Add Entry" button
calorieCounter.addEventListener("submit", calculateCalories); // Add event listener to the form submission
clearButton.addEventListener("click", clearForm); // Add event listener to the "Clear" button
