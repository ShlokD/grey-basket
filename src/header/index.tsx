import { useState } from "preact/hooks";
const Header = () => {
  const [search, setSearch] = useState("");
  return (
    <div
      style={{ minHeight: "200px" }}
      className="bg-blue-300 rounded-b-3xl w-full flex flex-col"
    >
      <h1 className="p-4 mt-8 font-bold text-3xl text-black">
        Grey Basket Notes
      </h1>
      <input
        placeholder="Search"
        value={search}
        className="w-90 p-2 mx-4 border border-gray-500 text-lg placeholder-gray-500 rounded-lg bg-transparent"
        onChange={(ev: Event) =>
          setSearch((ev?.target as HTMLInputElement)?.value)
        }
        aria-label="Search"
      />
    </div>
  );
};

export default Header;
