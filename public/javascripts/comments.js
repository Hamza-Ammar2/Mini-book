const comments = [...document.querySelectorAll(".comments")];

comments.forEach(comment => {
    const btn = comment.lastChild;
    const parent = comment.parentElement;
    btn.addEventListener('click', (e) => {
        btn.style.display = "none";
        let postComments = JSON.parse(comment.dataset.comments).reverse();
        let id = parent.getAttribute('id');
        parent.innerHTML += `
        <form action="/${id}/comment" method='POST' class="d-flex flex-row mb-3" style="align-items: center; justify-content: center; gap: 10px">
            <input name="comment" type="text" class="form-control" id="comment" placeholder="Comment." required>
            <button type="submit" class="btn btn-primary">Add comment</button>
        </form>`;

        postComments.forEach(com => {
            let pic;

            if (com.user.pic) {
                pic = com.user.pic
            } else pic = "/images/person.png";

            parent.innerHTML += `
                <hr></hr>
                <div class="mb-3 card-body">
                    <div class="mb-3 d-flex flex-row" style="align-items: center; gap: 10px">
                        <img src="${pic}" class="profile" style="width: 2.5rem; height: 2.5rem;"/>
                        <a href="/users/${com.user._id}">
                            <h5 class="card-title">${com.user.username}</h5>
                        </a>
                    </div>
                    <p>${com.text}</p>
                </div>
            `; 
        });
        
    });
});