const btn = document.getElementById("profile");
const body = document.querySelector("body");
let img = "";


btn.addEventListener('click', () => {
    body.innerHTML += `
        <form class="rounded picy" onsubmit="submit">
            <label>Choose your Profile Picture</label>
            <img class="rounded" id="display" style="width: 100%; height: auto; display: none;">
            <input id="upload" name="pic" class="form-control mb-3" type="file">
            <button class="btn btn-primary">Add Profile Picture</button>
        </form>
    `;

    document.getElementById("upload").addEventListener("change", function(e) {
        const reader = new FileReader();
        console.log("shit");
        reader.addEventListener("load", () => {
            img = reader.result;
            document.getElementById("display").style.display = "block";
            document.getElementById("display").setAttribute('src', img);
        });

        reader.readAsDataURL(this.files[0]);
    });


    document.querySelector(".picy").onsubmit = (e) => {
        e.preventDefault();

        fetch(location.origin + "/users/edit-pic", {
            method: 'POST',
            headers: {accept: 'application.json', 'content-type': 'application/json'},
            body: JSON.stringify({
                pic: img
            })
        }, () => location.reload());
    };
});