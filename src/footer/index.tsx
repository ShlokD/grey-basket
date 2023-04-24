const Footer = () => (
  <footer className="fixed bottom-0 w-full flex p-6 items-center justify-around border border-white z-10 bg-black">
    <a href="/">
      <div className="bg-white p-3 rounded-full">
        <img src="/pen.png" width="36" height="36" alt="Add Note" />
      </div>
    </a>
    <a href="/?q=favorites">
      <div className="bg-white p-3 rounded-full">
        <img src="/star.png" width="36" height="36" alt="Favorites" />
      </div>
    </a>
    <a href="/?q=reminders">
      <div className="bg-white p-3 rounded-full">
        <img src="/flag.png" width="36" height="36" alt="Reminders" />
      </div>
    </a>
  </footer>
);

export default Footer;
