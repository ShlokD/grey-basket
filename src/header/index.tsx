import { useState } from "preact/hooks";
const Header = () => {
  const [search, setSearch] = useState("");
  return (
    <header
      style={{ minHeight: "200px" }}
      className="bg-blue-900 rounded-b-3xl w-full flex flex-col"
    >
      <h1 className="p-4 mt-8 font-bold text-3xl text-white">
        Grey Basket Notes
      </h1>
      <input
        placeholder="Search"
        value={search}
        className="w-90 p-2 mx-4 border border-green-900 text-white text-lg placeholder-gray-200 rounded-lg bg-green-900"
        onChange={(ev: Event) =>
          setSearch((ev?.target as HTMLInputElement)?.value)
        }
        aria-label="Search"
      />
    </header>
  );
};

export default Header;
