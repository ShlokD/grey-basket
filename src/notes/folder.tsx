import type { JSX } from "preact";
import { useState } from "preact/hooks";
import type { Folder } from "../types";

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
  handleFolderDelete,
}: {
  folders: Folder[];
  currentFolder: string;
  showFoldersForm: boolean;
  handleFolderClick: (name: string) => void;
  handleFolderDelete: (folder: Folder) => void;
}): JSX.Element | null => {
  const [showAlert, setShowAlert] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  const doDeleteFolder = (folder: Folder) => {
    setFolderToDelete(folder);
    setShowAlert(true);
  };

  const handleCancel = () => {
    setShowAlert(false);
    setFolderToDelete(null);
  };

  const handleProceed = () => {
    setShowAlert(false);
    if (folderToDelete) {
      handleFolderDelete(folderToDelete);
    }
    setFolderToDelete(() => null);
  };

  return folders?.length > 0 ? (
    <>
      {showAlert && (
        <div
          className="z-10 absolute center bg-white text-black flex items-center justify-center flex-col absolute my-2 rounded-lg"
          style={{
            top: "50%",
            left: "50%",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="font-bold text-center p-2">
            Deleting a folder will also delete the notes in it.
          </p>
          <div className="flex items-center justify-around my-2">
            <button className="p-2 bg-blue-300 mx-2" onClick={handleCancel}>
              Cancel
            </button>
            <button className="p-2 bg-blue-300 mx-2" onClick={handleProceed}>
              Proceed
            </button>
          </div>
        </div>
      )}
      <div
        className={`flex items-start w-full h-1/12 overflow-x-auto overflow-y-visible my-2 p-2 ${
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
            <div className="flex flex-col items-center">
              <p className="text-white inline">{folder.name || "Home"}</p>
              {folder.name !== "Home" && (
                <button
                  className="bg-white p-2 rounded-full inline mx-2"
                  onClick={() => doDeleteFolder(folder)}
                  aria-label="Delete folder"
                >
                  <img
                    src="/trash.png"
                    height="16px"
                    width="16px"
                    alt="Delete icon"
                  />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <hr className="border border-white w-full" />
    </>
  ) : null;
};
