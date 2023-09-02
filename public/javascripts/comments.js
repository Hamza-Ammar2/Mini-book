const commentcontrols = [...document.querySelectorAll('.post-background')];
const body = document.querySelector('body');
const main = document.querySelector('main');
const user = JSON.parse(main.dataset.user);
const imgSRC = user.pic ? user.pic : '/images/person.png';
const url = `/users/${user._id}`;

commentcontrols.forEach(ctn => {
    const comlen = ctn.querySelector(".com-len");
    const commentbtn = ctn.querySelector('#comments');
    const cont = ctn.querySelector('.post-cont');
    const comments = ctn.querySelector('.comments');
    const h2 = ctn.querySelector('h2');
    const addComment = ctn.querySelector('.add-comment');
    const dis = ctn.querySelector('.post-dis'); 
    const x = ctn.querySelector('.close');
    const like = ctn.querySelector("#like");
    const likes = ctn.querySelector(".like-cont").querySelector("p");
    const like_p = like.querySelector("p");

    commentbtn.addEventListener('click', () => {
        ctn.classList.add('post-background-active');
        h2.style.display = 'block';
        addComment.style.display = 'flex';
        comments.style.display = 'flex';
        x.style.display = 'block';
        dis.classList.add('dis-active');
        body.style.overflow = 'hidden';
    });

    x.addEventListener('click', () => {
        ctn.classList.remove('post-background-active');
        h2.style.display = null;
        addComment.style.display = null;
        comments.style.display = null;
        x.style.display = null;
        dis.classList.remove('dis-active');
        body.style.overflow = null;
        [...ctn.querySelectorAll('.add-reply')].forEach(elm => elm.remove());
        [...comments.querySelectorAll('.comment-cont')].forEach(comCont => {
            [...comCont.querySelectorAll('#reply')].forEach(elm => elm.dataset.touched = 'none');
            
            if (!comCont.querySelector('.replies')) return;
            if (!comCont.querySelector('.replies').childElementCount)
                comCont.querySelector('hr').style.display = 'none';
        });
    });

    [...comments.querySelectorAll('.comment-cont')].forEach(comCont => {
        const reply = comCont.querySelector('#reply');
        const like = comCont.querySelector('#comment-like');
        const likp = comCont.querySelector('#comment-likes');
        const replies = comCont.querySelector(".replies");

        reply.addEventListener('click', addReplyForm);
        if (like)
            like.addEventListener('click', (e) => {
                fetch(`${window.location.origin}/${comCont.getAttribute("id")}/${e.target.textContent === 'Like' ? "add-like-comment" : "remove-like-comment"}`, {
                    method: 'POST'
                })
                    .then(res => {
                        let f = e.target.textContent === 'Like' ? 1 : -1; 
                        e.target.textContent = e.target.textContent === 'Like' ? "Unlike" : "Like";
                        
                        likp.textContent = Number(likp.textContent) + f;
                    });
            });
        
        let r = replies ? replies.querySelectorAll(".comment-cont") : null;
        if (r) {    
            const repls = [...r];
            repls.forEach(rep => {
                const like = rep.querySelector(".reply-like");
                const likp = rep.querySelector("#reply-likes");

                if (like)
                    like.addEventListener('click', (e) => {
                        fetch(`${window.location.origin}/${like.getAttribute("id")}/${e.target.textContent === 'Like' ? "add-like-reply" : "remove-like-reply"}`, {
                            method: 'POST'
                        })
                            .then(res => {
                                let f = e.target.textContent === 'Like' ? 1 : -1; 
                                e.target.textContent = e.target.textContent === 'Like' ? "Unlike" : "Like";
                                
                                likp.textContent = Number(likp.textContent) + f;
                            });
                    });
            });
        }
    });

    like.addEventListener('click', (e) => {
        fetch(`${window.location.origin}/${ctn.getAttribute("id")}/${like_p.textContent === 'Like' ? "add-like" : "remove-like"}`, {
            method: 'POST'
        })
            .then(res => {
                let f = like_p.textContent === 'Like' ? 1 : -1; 
                like_p.textContent = like_p.textContent === 'Like' ? "Unlike" : "Like";
                
                likes.textContent = Number(likes.textContent) + f;
            });
    });


    addComment.onsubmit = function(e) {
        e.preventDefault();

        const input = addComment.querySelector('input');
        if (input.value == "") return;

        fetch(`${window.location.origin}/${ctn.getAttribute("id")}/comment`, {
            method: 'POST',
            body: JSON.stringify({comment: input.value}),
            headers: {"Content-type": "application/json"}
        })
            .then(res => res.json())
            .then(res => {
                const newComment = createComment(res, input.value);
                input.value = "";
                comments.insertBefore(newComment, comments.firstChild);
                comlen.textContent = String(Number(comlen.textContent.split(" ")[0]) + 1) + " comments";
                console.log("huh");
            });
    }
});

function addReplyForm(e) {
    if (e.target.dataset.touched === 'touched') return;
    const comment = JSON.parse(e.target.dataset.comment);
    const comCont = document.getElementById(comment._id);
    const replyingTo = JSON.parse(e.target.dataset.replyingto);
    const replies = comCont.querySelector('.replies')

    comCont.querySelector('hr').style.display = 'block';
    replies.append(createReplyForm(comment, replyingTo, e.target));

    e.target.dataset.touched = 'touched';
}

function createReplyForm(comment, replyingTo, reset) {
    const form = document.createElement('form');
    const img = document.createElement('img');
    const div = document.createElement('div');
    const input = document.createElement('input');

    form.className = 'add-comment add-reply';
    img.setAttribute('src', `${user.pic ? user.pic : '/images/person.png'}`);
    img.classList.add('user-pic');
    div.classList.add('search-cont');
    div.append(input);
    form.append(img, div);
    form.style.display = 'flex';
    input.setAttribute('placeholder', 'Write a reply..');

    form.onsubmit = function(e) {
        e.preventDefault();
        
        fetch(`${window.location.origin}/${comment._id.toString()}/reply`, {
            method: 'POST',
            body: JSON.stringify({
                text: input.value,
                replyingTo: replyingTo._id
            }),
            headers: {"Content-type": "application/json"}
        })
            .then(res => res.json())
            .then(res => {
                e.target.parentElement.append(createReply(res, comment, replyingTo, input.value));
                reset.dataset.touched = 'no';
                e.target.remove();
            })
    }

    return form;
}

function createReply(Reply, comment, replyingTo, text) {
    const comCont = document.createElement('div');
    const img = document.createElement('img');
    const comBody = document.createElement('div');
    const divOpts = document.createElement('div');
    const like = document.createElement('p');
    const reply = document.createElement('p');

    comCont.className = 'comment-cont';
    comCont.setAttribute('id', comment._id);
    img.setAttribute('src', imgSRC);
    img.classList.add('user-pic');
    comBody.classList.add('comment-body');
    divOpts.classList.add('comment-opts');
    comBody.innerHTML = `
        <a href='${url}'>
            <h4>${user.username}</h4>
        </a>
        <p><a href="/users/${replyingTo._id.toString()}">@${replyingTo.username}</a> ${text}</p>
        <div class='like-cont'>
            <img src='/images/likes-icon.png'>
            <p id="reply-likes">0</p>
        </div>
    `;
    const likp = comBody.querySelector("#reply-likes");

    reply.dataset.comment = JSON.stringify(comment);
    reply.dataset.replyingto = JSON.stringify(replyingTo);
    reply.setAttribute('id', 'reply');
    like.setAttribute('id', 'comment-like');
    like.innerText = 'Like';
    reply.innerText = 'Reply';
    like.addEventListener('click', (e) => {
        fetch(`${window.location.origin}/${Reply._id}/${e.target.textContent === 'Like' ? "add-like-reply" : "remove-like-reply"}`, {
            method: 'POST'
        })
            .then(res => {
                let f = e.target.textContent === 'Like' ? 1 : -1; 
                e.target.textContent = e.target.textContent === 'Like' ? "Unlike" : "Like";
                
                likp.textContent = Number(likp.textContent) + f;
            });
    });

    reply.addEventListener('click', addReplyForm);
    divOpts.append(like, reply);
    comCont.append(img, comBody, divOpts);

    return comCont;
}

function createComment(comment, text) {
    const comCont = document.createElement('div');
    comCont.classList.add('comment-cont');
    comCont.innerHTML = `
        <img class='user-pic' src='${imgSRC}'>
        <div class='comment-body' id='${comment._id}'>
            <a href='${url}'>
                <h4>${user.username}</h4>
            </a>
            <p>${text}</p>
            <div class='like-cont'>
                <img src='/images/likes-icon.png'>
                <p id="comment-likes">0</p>
            </div>
        </div>
        <div class='comment-opts'>
            <p id='comment-like'>Like</p>
            <p id='reply' 
                data-comment='${JSON.stringify(comment)}' 
                data-user='${JSON.stringify(comment.user)}'>Reply</p>
        </div>
        <hr class='comment-hr' style='display: none;'>
        <div class='replies'></div>
    `;
    comCont.setAttribute("id", comment._id);
    const likp = comCont.querySelector('#comment-likes');

    comCont.querySelector('#reply').addEventListener('click', addReplyForm);
    comCont.querySelector('#comment-like').addEventListener('click', (e) => {
        fetch(`${window.location.origin}/${comCont.getAttribute("id")}/${e.target.textContent === 'Like' ? "add-like-comment" : "remove-like-comment"}`, {
            method: 'POST'
        })
            .then(res => {
                let f = e.target.textContent === 'Like' ? 1 : -1; 
                e.target.textContent = e.target.textContent === 'Like' ? "Unlike" : "Like";
                
                likp.textContent = Number(likp.textContent) + f;
            });
    });
    return comCont;
}