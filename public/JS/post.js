document.getElementById("file-upload").files[0]
let form = new FormData()
let req = new XMLHttpRequest()
FormData.append("video",video)
let formData = new FormData();
fetch('../../Uploads', {method: "POST", body: formData});
