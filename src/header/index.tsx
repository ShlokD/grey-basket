import { Link, route } from "preact-router";
import { useState } from "preact/hooks";

const Header = () => {
  const [search, setSearch] = useState("");

  const handleSubmit = (ev: KeyboardEvent) => {
    if (ev.keyCode === 13) {
      route(`/search?q=${search}`);
      setSearch("");
    }
  };

  return (
    <header
      style={{ minHeight: "240px" }}
      className="bg-blue-900 rounded-b-3xl w-full flex flex-col"
    >
      <h1 className="p-4 mt-8 font-bold text-3xl text-white">Grey Basket</h1>
      <input
        placeholder="Search"
        value={search}
        className="w-90 p-2 mx-4 border border-green-900 text-white text-lg placeholder-gray-200 rounded-lg bg-green-900"
        onInput={(ev: Event) => {
          setSearch((ev?.target as HTMLInputElement)?.value);
        }}
        onKeyDown={handleSubmit}
        aria-label="Search"
      />
      <div className="flex items-center justify-center my-4">
        <Link href="/">
          <div className="bg-white p-3 mx-2 rounded-full">
            <img src="/pen.png" width="36" height="36" alt="Add Note" />
          </div>
        </Link>
        <Link href="/favorites">
          <div className="bg-white p-3 mx-2 rounded-full">
            <img src="/star.png" width="36" height="36" alt="Favorites" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
