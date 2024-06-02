
var genders = document.getElementById("gender");
var option = document.createElement("option");
option.value = "Male";
option.textContent = "Male";
genders.appendChild(option);

var option = document.createElement("option");
option.value = "Female";
option.textContent = "Female";
genders.appendChild(option);

document.getElementById("myButton").addEventListener("click", submitNewPatient);

async function submitNewPatient() {
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var weight = document.getElementById("weight").value;
  var height = document.getElementById("height").value;
  var gender = document.getElementById("gender").value;
  var age = document.getElementById("age").value;

  var body = {
    firstname: firstName,
    lastname: lastName,
    height: parseFloat(height),
    weight: parseFloat(weight),
    age: parseInt(age),
    sex: gender
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), // Convert the JavaScript object to a JSON string
  };

  await fetch("http://localhost:3000/api/patient/create", options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      window.location.href = "homepage.html"
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      console.log("Success:", data); // Handle the JSON data
    })
    .catch((error) => {
      console.error("Error:", error); // Handle any errors
    });
}
