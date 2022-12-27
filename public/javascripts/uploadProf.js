const btn = document.getElementById("profile");
const body = document.querySelector("body");
let img = "";


btn.addEventListener('click', () => {
    body.innerHTML += `
        <form class="rounded picy d-flex flex-column" onsubmit="submit" style="border: 1px solid black; min-height: 20rem; background-color: white; align-items: center;">
            <h5>Choose your Profile Picture</h5>
            <hr></hr>
            <div class="d-flex flex-column" style="flex: 1; align-items: center; justify-content: center;">
                <img class="profile" id="display" style="width: 10rem; height: 10rem; display: none;">
            </div>
            <input id="upload" name="pic" class="form-control mb-3" type="file">
            <button class="btn btn-primary">Add Profile Picture</button>
        </form>
    `;

    document.getElementById("upload").addEventListener("change", function(e) {
        const reader = new FileReader();
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
                pic: document.getElementById("display").getAttribute("src")
            })
        }, () => location.reload());
    };
});