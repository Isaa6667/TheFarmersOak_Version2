var FORM_KEY = "b77b66c0-fea6-4e77-a859-02f705b0f06b";

(function () {
    var burger = document.querySelector(".burger");
    var nav = document.getElementById("nav");

    if (burger && nav) {
        burger.addEventListener("click", function () {
            var open = nav.classList.toggle("open");
            burger.setAttribute("aria-expanded", open);
        });
    }

    var year = document.getElementById("yr");
    if (year) year.textContent = new Date().getFullYear();

    var form = document.getElementById("cf");

    if (form) {
        var status = document.getElementById("fs");
        var button = form.querySelector('button[type="submit"]');

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            var data = Object.fromEntries(new FormData(form));

            if (data.website) return;

            data.access_key = FORM_KEY;
            data.subject = "New website enquiry: The Farmers Oak";
            data.from_name = "The Farmers Oak website";

            button.disabled = true;
            status.textContent = "Sending your message...";

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(function (response) {
                return response.json().then(function (result) {
                    if (!response.ok || !result.success) {
                        throw new Error(result.message || "Failed to send");
                    }
                    return result;
                });
            })
            .then(function () {
                form.reset();
                status.textContent = "Thank you, your message has been sent. We will reply as soon as we can.";
            })
            .catch(function (error) {
                console.error("Contact form error:", error);
                status.textContent = "Sorry, your message could not be sent. Please email TheFarmersOak@outlook.com.";
            })
            .finally(function () {
                button.disabled = false;
            });
        });
    }
})();
