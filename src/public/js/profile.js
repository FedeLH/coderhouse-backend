const fileUploadForm = document.getElementById('fileUploadForm')
const user = document.querySelector('.user')
const uid = user.id

const uploadFiles = () => {
    const form = new FormData();
    const id = document.getElementById('file1');
    const address = document.getElementById('file2');
    const account = document.getElementById('file3');

    const getFileExtension = (file) => {
        return file.name.split('.').pop();
    }

    form.append('type', 'documents');
    form.append('files', id.files[0], 'id.'+getFileExtension(id.files[0]));
    form.append('files', address.files[0], 'address.'+getFileExtension(address.files[0]));
    form.append('files', account.files[0], 'account.'+getFileExtension(account.files[0]));

    fetch(`/api/users/${uid}/documents`, {
        method: 'POST',
        body: form
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        Swal.fire({
            text: `Archivos cargados`,
            toast: true,
            position: "top-right",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
    })
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: `Ocurrió un error: ${error} ${error.message}`,
        });
    });
}

const changeRole = async () => {
    try {
        let response = await fetch(`/api/users/premium/${uid}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        });
        let data = await response.json();
        let statusResponse = data.status;
        
        Swal.fire({
            text: data.payload,
            icon: "success",
        }).then((result) => {
            if (result.isConfirmed && statusResponse === "success") {
                fetch(`/api/sessions/logout`, {
                    method: "GET",
                }).then(() => {
                    window.location.href = "/login";
                });
            }
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: `Ocurrió un error: ${error} ${error.message}`,
        });
    }
};

document.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.classList.contains("change-role")) {
        changeRole();
    }
});

fileUploadForm.addEventListener('submit', function(event) {
    event.preventDefault();
    uploadFiles();
});