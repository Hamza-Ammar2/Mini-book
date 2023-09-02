const editInit = [...document.querySelectorAll('.init-edit')];


editInit.forEach(init => {
    init.addEventListener('click', () => {
        const parent = init.parentElement;

        parent.querySelector('p').style.display = 'none';
        parent.querySelector('form').style.display = 'flex';
        init.style.display = 'none'
    });
});