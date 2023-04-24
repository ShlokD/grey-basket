import type { Folder } from "./types";
import { useState } from "preact/hooks";
import type { JSX } from "preact";
export const FolderForm = ({
  onClose,
  onCancel,
}: {
  onClose: (name: string) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState("");

  const handleClose = () => {
    if (!name) {
      return;
    }
    onClose(name);
    setName("");
  };

  const handleCancel = () => {
    setName("");
    onCancel();
  };
  return (
    <div className="flex flex-col items-center justify-center w-full h-full my-4">
      <input
        className="bg-green-200 p-4 rounded-lg w-11/12 m-4 placeholder-gray text-black"
        value={name}
        onChange={(ev) => setName((ev?.target as HTMLInputElement)?.value)}
        placeholder="Name"
        aria-label="Enter folder name"
      />
      <div className="flex items-center justify-center">
        <button
          className="bg-blue-100 text-black font-bold rounded-lg p-4 my-4 mx-2"
          onClick={handleClose}
        >
          Save
        </button>
        <button
          className="bg-blue-100 text-black font-bold rounded-lg p-4 my-4 mx-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const FolderList = ({
  folders,
  currentFolder,
  showFoldersForm,
  handleFolderClick,
}: {
  folders: Folder[];
  currentFolder: string;
  showFoldersForm: boolean;
  handleFolderClick: (name: string) => void;
}): JSX.Element | null =>
  folders?.length > 0 ? (
    <>
      <div
        className={`flex items-center w-full h-1/12 overflow-x-scroll my-2 p-2 ${
          showFoldersForm ? "hidden" : ""
        }`}
      >
        {folders.map((folder, idx) => (
          <div className="flex flex-col items-center justify-center">
            <button
              className={`p-4 mx-4 my-2 rounded-full ${
                folder.name === currentFolder ? "bg-blue-300" : "bg-white"
              }`}
              key={`folder-${idx}`}
              onClick={() => handleFolderClick(folder.name)}
              aria-label={folder.name}
            >
              <img src="/folder.png" alt="Folder" height="36" width="36" />
            </button>
            <p className="text-white">{folder.name || "Home"}</p>
          </div>
        ))}
      </div>
      <hr className="border border-white w-full" />
    </>
  ) : null;
