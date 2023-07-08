const form = document.querySelector('#resetForm')
const url = new URL(window.location.href)
const uid = url.pathname.substring(16)
const token = url.searchParams.get("token")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const data = new FormData(form)
    const obj = {
        uid,
        token
    }
    data.forEach((value, key) => obj[key] = value)
    fetch("/api/passwords/reset",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    })
        .then(response =>{
            if(response.status === 404) return response.json()
            if(!response.ok) throw new Error("Error HTTP: " + response.status)
            return response.json()
        })
        .then( data => {
            if(data.status === 'error') throw new Error(data.payload.message)
            Swal.fire({
                text: data.payload,
                icon: 'success',
                title: 'Good!'
            }).then(_ => window.location.replace('/login'));
        })
        .catch(error => Swal.fire({
            text: error.message,
            icon: 'error',
            title: 'Oops...'
        }))
})