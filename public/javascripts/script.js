//previsualizar la imagen

function readURL(input, element) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
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
      if ( response.data.add === 1){
        likeNumber.innerText = 1;        
      } else {
        likeNumber.innerText = ""
      }
    })
    .catch((e) => console.error("Error liking a service", e));
};

//contact us

$("#mailForm").on("submit", e => {
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

//ver password

$(document).ready(function () {
  $("#show_hide_password a").on('click', function (event) {
    event.preventDefault();
    if ($('#show_hide_password input').attr("type") == "text") {
      $('#show_hide_password input').attr('type', 'password');
      $('#show_hide_password i').addClass("fa-eye-slash");
      $('#show_hide_password i').removeClass("fa-eye");
    } else if ($('#show_hide_password input').attr("type") == "password") {
      $('#show_hide_password input').attr('type', 'text');
      $('#show_hide_password i').removeClass("fa-eye-slash");
      $('#show_hide_password i').addClass("fa-eye");
    }
  });
});

//read more

$(document).ready(function() {
  var maxLength = 40;
  $(".readMore").each(function () {
    var myStr = $(this).text();

    if ($.trim(myStr).length > maxLength) {
      var newStr = myStr.substring(0, maxLength);
            var removedStr = myStr.substring(maxLength, $.trim(myStr).length);
            $(this).empty().html(newStr);
            $(this).append(' <a <a href="javascript:void(0); class="read-more">Read more...</a>');
            $(this).append('<span class="more-text">' + removedStr + '</span>');
        }
    });
    $(".readMore").click(function(){
        $(this).siblings(".more-text").contents().unwrap();
        $(this).remove();
    });
});
  

// para que se borré con axios 
const deleteCard = (id) => {
  axios
    .get(`/service/${id}/delete`)
    .then((response) => {
      if (response.status == 204) {
        const node = document.getElementById(`${id}`);
        if (node) {
          node.remove();
          const cardList = document.querySelectorAll(".marketcard")
          if (cardList.length == 0) {
            const containerNode = document.getElementById("pills-home")
            let textNode = document.createTextNode("Here you will find all the services that you publish 😁");
            containerNode.appendChild(textNode);
          }
        }
      }
    })
    .catch((e) => console.error("Error liking a service", e));

}

const cancelCard = (id) => {
  axios
    .get(`/service/${id}/cancel`)
    .then((response) => {
      if (response.status == 204) {
        const node = document.getElementById(`${id}`);
        if (node) {
           node.remove();
           const cardList = document.querySelectorAll(".marketcard")
           if (cardList.length == 0) {
             const containerNode = document.getElementById("pills-home")
             let textNode = document.createTextNode("Here you will find all the services that you buy &#x1F60F");
             containerNode.appendChild(textNode);
           }
         }
       }
     })
     .catch((e) => console.error("Error liking a service", e));

}

setTimeout(() => {
  document.querySelectorAll(".toast").forEach((toast) => {
    console.log(toast);
    new bootstrap.Toast(toast).hide();
  });
}, 5000);
