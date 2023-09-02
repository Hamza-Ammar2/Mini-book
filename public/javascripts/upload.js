const upload = document.getElementById('upload');
const droparea = document.querySelector('.drop-area');
const form = document.querySelector('.add-post-form');
const addInit = document.querySelector('.add-post-cont');
const x = form.querySelector('#close');
let pic;

addInit.addEventListener('click', () => {
    form.parentElement.style.display = 'flex';
    body.style.overflow = 'hidden';
});


x.addEventListener('click', () => {
    pic = '';
    droparea.style.backgroundImage = null;
    droparea.querySelector('span').style.display = null;
    form.parentElement.style.display = null;
    body.style.overflow = null;
});




droparea.addEventListener('dragover', e => {
    e.preventDefault();
    droparea.classList.add('draged-over');


});

['dragend', 'dragleave'].forEach(type => {
    droparea.addEventListener(type, e => {
        droparea.classList.remove('draged-over');
    });
});

droparea.addEventListener('drop', e => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
        
        upload.files = e.dataTransfer.files;
        updateThumbnail(droparea, e.dataTransfer.files[0]);
    }
    
    droparea.classList.remove('draged-over');
});


droparea.addEventListener('click', e => {
    upload.click();
});

upload.addEventListener('change', e => {
    if (!upload.files.length) return;

    updateThumbnail(droparea, upload.files[0]);
});


function updateThumbnail(elm, file) {
    if (!file.type.startsWith('image/')) {
        elm.querySelector('span').style.display = null;
        elm.style.backgroundImage = null;
        pic = '';
        return alert('Only images!');
    }

    elm.querySelector('span').style.display = 'none';
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function() {
        elm.style.backgroundImage = `url('${reader.result}')`;
        pic = reader.result;
    }
}