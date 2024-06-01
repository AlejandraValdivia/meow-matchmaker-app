console.log("Email Contact Form");
const form = document.querySelector("form");
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const message = document.getElementById("message");
const subject = document.getElementById("subject");

function sendEmail() {
  console.log("Email", EMAIL_USERNAME);
  const bodyMessage = `Full Name ${fullName.value}<br/> Email: ${email.value}<br/> Phone Number: ${phone.value}<br/> Message: ${message.value}`; // come back
  // need a keys.js file for username and password
  Email.send({
    Host: "smtp.elasticemail.com",
    username: "EMAIL_USERNAME",
    password: "EMAIL_PASSWORD",
    To: "EMAIL_USERNAME",
    From: "EMAIL_USERNAME",
    Subject: subject.value,
    Body: bodyMessage,
  }).then((message) => {
    // if (message === "OK") {
    Swal.fire({
      title: "Success!",
      text: "Message sent successfully!",
      icon: "success",
    });
    //}
  });
}

function checkInputs() {
  const items = document.querySelectorAll(".item");

  for (const item of items) {
    if (item.value === "") {
      item.classList.add("error");
      item.parentElement.classList.add("error");
    }

    if (items[1].value !== "") {
      checkEmail();
    }

    items[1].addEventListener("keyup", () => {
      checkEmail();
    });

    items;

    item.addEventListener("keyup", () => {
      if (item.value !== "") {
        item.classList.remove("error");
        item.parentElement.classList.remove("error");
      } else {
        item.classList.add("error");
        item.parentElement.classList.add("error");
      }
    });
  }
}

function checkEmail() {
  const emailRegex = /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
  const errorTxtEmail = document.querySelector(".error-txt.email");

  if (!email.value.match(emailRegex)) {
    email.classList.add("error");
    email.parentElement.classList.add("error");

    if (email.value !== "") {
      errorTxtEmail.textContent = "Enter a valid email address";
    } else {
      errorTxtEmail.textContent = "Email Address cannot be blank";
    }
  } else {
    email.classList.remove("error");
    email.parentElement.classList.remove("error");
  }
}

// form.addEventListener("submit", (e) => {
//   e.preventDefault(); // look this up and get familiar
//   checkInputs();

//   if (
//     !fullName.classList.contains("error") &&
//     !email.classList.contains("error") &&
//     !phone.classList.contains("error") &&
//     !subject.classList.contains("error") &&
//     !message.classList.contains("error")
//   ) {
//     console.log("OK!");
//     sendEmail();
//     form.reset();

//     return false;
//   }
// });
