import { DatasetItem } from '../hooks/useDataset';
import { Tag } from './Tag';

export type FactData = {
  id: string;
  text: string;
  date: Date;
  tagsIds: string[];
};

export type Fact = DatasetItem<
  FactData & {
    getTags: () => Tag[];
    addTag: (tag: Tag) => void;
    removeTag: (tag: Tag) => void;
  }
>;
