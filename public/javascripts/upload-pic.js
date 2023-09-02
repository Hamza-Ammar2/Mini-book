const Upload = document.getElementById('upload-pic');
const Droparea = document.querySelector('.drop-area-pic');
const Fom = document.querySelector('.edit-pic-form');
const AddInit = document.getElementById('edit-pic');
const Body = document.querySelector('body');
const X = Fom.querySelector('#close-pic');
let Pic;

AddInit.addEventListener('click', () => {
    Fom.parentElement.style.display = 'grid';
    Body.style.overflow = 'hidden';
});


X.addEventListener('click', () => {
    Pic = '';
    Droparea.style.backgroundImage = null;
    Droparea.querySelector('span').style.display = null;
    Fom.parentElement.style.display = null;
    Body.style.overflow = null;
});




Droparea.addEventListener('dragover', e => {
    e.preventDefault();
    Droparea.classList.add('draged-over');


});

['dragend', 'dragleave'].forEach(type => {
    Droparea.addEventListener(type, e => {
        Droparea.classList.remove('draged-over');
    });
});

Droparea.addEventListener('drop', e => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
        
        Upload.files = e.dataTransfer.files;
        updateThumbnail(Droparea, e.dataTransfer.files[0]);
    }
    
    Droparea.classList.remove('draged-over');
});


Droparea.addEventListener('click', e => {
    Upload.click();
});

Upload.addEventListener('change', e => {
    if (!Upload.files.length) return;

    updateThumbnail(Droparea, Upload.files[0]);
});


function updateThumbnail(elm, file) {
    if (!file.type.startsWith('image/')) {
        elm.querySelector('span').style.display = null;
        elm.style.backgroundImage = null;
        Pic = '';
        return alert('Only images!');
    }

    elm.querySelector('span').style.display = 'none';
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function() {
        elm.style.backgroundImage = `url('${reader.result}')`;
        Pic = reader.result;
    }
}