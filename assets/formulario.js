const form = document.getElementById("registro");
const submitButton = document.getElementById("registrar-btn");
const testInicio = document.getElementById("start-form");

form.addEventListener("submit", async function (e) {
e.preventDefault();

submitButton.disabled = true;
submitButton.textContent = "Enviando...";

try {
    const formData = new FormData(this);
    const formDataObj = {};

    
    for (let [key, value] of formData.entries()) {
    formDataObj[key] = value;
    }

    //URL al script del API 
    const scriptURL = "https://script.google.com/macros/s/AKfycbz1ulYy0Gd9o8Sap19XFBCK0i3Sxyz89IkDo6B-Xvbv6RgN2KcMrYmEEhiECiXGxJsA/exec";

    const response = await fetch(scriptURL, {
    redirect: "follow",
    method: "POST",
    body: JSON.stringify(formDataObj),
    headers: {
        "Content-Type": "text/plain;charset=utf-8",
    },
    });

    const data = await response.json();

    if (data.status === "success") {
    form.reset();
    }
} catch (error) {
    console.error("Error:", error);
    alert("Error: " + error.message);
} finally {
    submitButton.disabled = false;
    submitButton.textContent = "Registrarse";
}
});