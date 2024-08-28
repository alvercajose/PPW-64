const socket =io()

socket.on('loadnotes', (data)=>{
    console.log(data)
})

const noteForm=document.querySelector('#noteForm')

noteForm.addEventListener('submit',() =>{
    e.preventDefault()

    console.log(
        noteForm['title'],value,
        noteForm['description'],value,
    );
})