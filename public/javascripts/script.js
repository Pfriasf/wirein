document.addEventListener('DOMContentLoaded', () => {

    console.log('IronGenerator JS imported successfully!');

}, false); //
//previsualizar la imagen

function readURL(input, element) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            debugger
            document.getElementById(`${element}`).setAttribute('src', e.target.result);

        }

        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }