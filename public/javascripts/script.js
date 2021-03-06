document.addEventListener('DOMContentLoaded', () => {
    console.log('IronGenerator JS imported successfully!');
}, false); 
//previsualizar la imagen

function readURL(input, element) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById(`${element}`).setAttribute('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
   };

//animación de la home

    let sizeOrb, angle;
    let root = document.documentElement;
    
    document.addEventListener("scroll", () => {
      sizeOrb = window.pageYOffset / 2;
      angle = window.pageYOffset * 4;
    
      if (sizeOrb > 200) {
        root.style.setProperty("--ring-size", sizeOrb + "px");
      }
    });

  // para los likes 
  
  const like = (element) => {
    axios
      .get(`/service/${element.getAttribute("data-serviceid")}/like`)
      .then((response) => {
        element.classList.toggle("unliked");
        const likeNumber = element.querySelector("span");
        likeNumber.innerText = Number(likeNumber.innerText) + response.data.add;
      })
      .catch((e) => console.error("Error liking a service", e));
  };

  ("form").on("submit", e => {
    e.preventDefault();
    const email = $("#email")
      .val()
      .trim();
    const fname = $("#fname")
      .val()
      .trim();
    const message = $("#message")
      .val()
      .trim();
    const data = {
      email,
      fname,
      message
    };
    $.post("/email", data)
      .then(() => {
        window.location.href = "/email/sent";
      })
      .catch(() => {
        window.location.href = "/error";
      });
  });