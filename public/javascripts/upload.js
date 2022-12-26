const upload = document.getElementById("upload");
const display = document.getElementById("display");
const form = document.getElementById("postForm");
const text = document.getElementById("post");
let img = "";

upload.addEventListener("change", function(e) {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        img = reader.result;
        display.style.display = "block";
        display.setAttribute('src', img);
    });

    reader.readAsDataURL(this.files[0]);
});


form.onsubmit = (e) => {
    e.preventDefault();
    let formData = new FormData(form);
    formData.delete("pic");
    formData.append("pic", img);

    fetch(location.origin + "/post", {
        method: 'POST',
        headers: {accept: 'application.json', 'content-type': 'application/json'},
        body: JSON.stringify({
            pic: display.getAttribute('src'),
            text: text.value
        })
    }).then(() => location.reload());
};