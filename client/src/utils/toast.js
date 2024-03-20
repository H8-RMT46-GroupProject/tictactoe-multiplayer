import Toastify from 'toastify-js'

export default function showToast({ message = "Something went wrong", status, backgroundColor }) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: backgroundColor || (status === "success" ? "green" : "red")
        },
        onClick: function () { } // Callback after click
    }).showToast();
}