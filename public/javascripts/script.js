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
      likeNumber.innerText = Number(likeNumber.innerText) + response.data.add;
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

$(document).ready(function () {
  $("#toggle").click(function () {
    var elem = $("#toggle").text();
    if (elem == "Read More") {
      //Stuff to do when btn is in the read more state
      $("#toggle").text("Read Less");
      $("#text").slideDown();
    } else {
      //Stuff to do when btn is in the read less state
      $("#toggle").text("Read More");
      $("#text").slideUp();
    }
  });
});

//input price
/*$("input[data-type='currency']").on({
  keyup: function() {
    formatCurrency($(this));
  },
  blur: function() { 
    formatCurrency($(this), "blur");
  }
});


function formatNumber(n) {
// format number 1000000 to 1,234,567
return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatCurrency(input, blur) {
// appends $ to value, validates decimal side
// and puts cursor back in right position.

// get input value
var input_val = input.val();

// don't validate empty input
if (input_val === "") { return; }

// original length
var original_len = input_val.length;

// initial caret position 
var caret_pos = input.prop("selectionStart");
  
// check for decimal
if (input_val.indexOf(".") >= 0) {

  // get position of first decimal
  // this prevents multiple decimals from
  // being entered
  var decimal_pos = input_val.indexOf(".");

  // split number by decimal point
  var left_side = input_val.substring(0, decimal_pos);
  var right_side = input_val.substring(decimal_pos);

  // add commas to left side of number
  left_side = formatNumber(left_side);

  // validate right side
  right_side = formatNumber(right_side);
  
  // On blur make sure 2 numbers after decimal
  if (blur === "blur") {
    right_side += "00";
  }
  
  // Limit decimal to only 2 digits
  right_side = right_side.substring(0, 2);

  // join number by .
  input_val = "$" + left_side + "." + right_side;

} else {
  // no decimal entered
  // add commas to number
  // remove all non-digits
  input_val = formatNumber(input_val);
  input_val = "$" + input_val;
  
  // final formatting
  if (blur === "blur") {
    input_val += ".00";
  }
}

// send updated string to input
input.val(input_val);

// put caret back in the right position
var updated_len = input_val.length;
caret_pos = updated_len - original_len + caret_pos;
input[0].setSelectionRange(caret_pos, caret_pos);
}*/



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