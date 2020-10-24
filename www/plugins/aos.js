import AOS from "aos";

import "aos/dist/aos.css";

export default ({ app }) => {
  app.AOS = new AOS.init({ disable: "phone" }); // eslint-disable-line new-cap
};
