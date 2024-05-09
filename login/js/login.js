$(document).ready(function () {

    // this prevents page reload on pressing enter
    $("form").submit(function (event) {
        event.preventDefault();
    });

    // click listener
    $('#btnSignIn').click(function () {
        if ($('input:text').val() == "admincms" && $('input:password').val() == "admin@123") {
            window.location.replace("./admin/index.html");
        }
        else if ($('input:text').val() == "ARUN" && $('input:password').val() == "ARUN@123") {
            window.location.replace("./caller/index.html");
        }
        else if ($('input:text').val() == "90329517" && $('input:password').val() == "90329517") {
            window.location.replace("./manager/index.html");
        }
        else if ($('input:text').val() == "908891215" && $('input:password').val() == "908891215") {
            window.location.replace("./employee/index.html");
        }
        else {
            alert('Wrong !');
        }
    });

});

// Favicon Change

const faviconTag = document.getElementById("faviconTag");
const isDark = window.matchMedia("(prefers-color-scheme: dark)");

const changeFavicon = () => {
    if (isDark.matches) {
        faviconTag.href = "./assets/images/logoIcon/cclDark.png";
    }
    else {

        faviconTag.href = "./assets/images/logoIcon/cclLight.png";
    }
};

changeFavicon();
isDark.addEventListener("change", changeFavicon);