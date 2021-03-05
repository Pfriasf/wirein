const hbs = require("hbs");
const path = require("path");

hbs.registerPartials(path.join(__dirname, "../views/partials"));

hbs.registerHelper("checkService", (optionValue, serviceValue, options) => {
  if (optionValue === serviceValue) {
    return options.fn();
  } else {
    return options.inverse();
  }
});
