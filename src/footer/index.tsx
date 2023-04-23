import pen from "../assets/pen.png";
import star from "../assets/star.png";
import flag from "../assets/flag.png";

const Footer = () => (
  <div className="fixed bottom-0 w-full flex p-6 items-center justify-around border border-white">
    <a href="/">
      <div className="bg-white p-3 rounded-full">
        <img src={pen} width="36" height="36" alt="Add Note" />
      </div>
    </a>
    <a href="/?q=favorites">
      <div className="bg-white p-3 rounded-full">
        <img src={star} width="36" height="36" alt="Favorites" />
      </div>
    </a>
    <a href="/?q=reminders">
      <div className="bg-white p-3 rounded-full">
        <img src={flag} width="36" height="36" alt="Reminders" />
      </div>
    </a>
  </div>
);

export default Footer;
