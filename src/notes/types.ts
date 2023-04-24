export type Note = {
  id: string;
  title: string;
  description: string;
  folder: string;
  favorite?: boolean;
};

export type Folder = {
  id: string;
  name: string;
};
