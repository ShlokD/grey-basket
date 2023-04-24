import { useState } from "preact/hooks";
export const AddButton = ({
  handleAddNote,
  handleAddFolder,
}: {
  handleAddNote: () => void;
  handleAddFolder: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleAddClick = (callback: () => void) => {
    setExpanded(false);
    callback();
  };

  return expanded ? (
    <div className="flex flex-col fixed bottom-32 z-auto right-4">
      <button
        className="border border-black bg-blue-300 p-4 text-black"
        onClick={() => handleAddClick(handleAddNote)}
      >
        Note
      </button>
      <button
        className="border border-black bg-blue-300 p-4 text-black"
        onClick={() => handleAddClick(handleAddFolder)}
      >
        Folder
      </button>
    </div>
  ) : (
    <button
      aria-label="Add a Note"
      className="px-6 py-4 bg-blue-300 my-4 text-5xl rounded-full fixed bottom-32 z-auto right-4"
      onClick={() => setExpanded((prev) => !prev)}
    >
      +
    </button>
  );
};
