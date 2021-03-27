import React, { useCallback, useEffect, useMemo } from 'react';

import { v4 as uuid } from 'uuid';

import { TagsProvider } from './contexts/TagsProvider';
import useDataset, { DatasetItem } from './hooks/useDataset';
import Layout from './layout';
import { Fact, FactData } from './types/Fact';
import { Tag, TagData } from './types/Tag';

type Data = { tags: TagData[]; facts: FactData[] };
const LOCAL_STORAGE_KEY = 'data';
const LOCAL_STORAGE_KEY_BACKUP = 'data-backup';

const useData = () => {
  const data = useMemo<Data>(() => {
    try {
      const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');

      localStorage.setItem(LOCAL_STORAGE_KEY_BACKUP, JSON.stringify(data));

      return {
        tags: data.tags,
        facts: data.facts.map((item: any) => ({ ...item, date: new Date(item.date) })),
      };
    } catch {
      return { tags: [], facts: [] };
    }
  }, []);

  const setData = useCallback((data: Data) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, []);

  return [data, setData] as const;
};

const useTags = (data: TagData[]) => {
  const [tags, { append }] = useDataset(data);

  return [tags, append] as const;
};

const useFacts = (data: FactData[], tags: Tag[]) => {
  const [facts, { prepend }] = useDataset(data);

  const makeFact = (item: DatasetItem<FactData>): Fact => ({
    ...item,
    getTags: () => tags.filter((tag) => item.tagsIds.includes(tag.id)),
    addTag: (tag) => item.update({ tagsIds: [...item.tagsIds, tag.id] }),
    removeTag: (tag) => item.update({ tagsIds: item.tagsIds.filter((id) => id !== tag.id) }),
  });

  return [facts.map(makeFact), prepend] as const;
};

const App: React.FC = () => {
  const [data, setData] = useData();
  const [tags, addTag] = useTags(data.tags);
  const [facts, addFact] = useFacts(data.facts, tags);

  const handleCreateFact = (text: string) => {
    addFact({ id: uuid(), text, date: new Date(), tagsIds: [] });
  };

  const handleCreateTag = (data: Omit<TagData, 'id'>) => {
    addTag({ id: uuid(), ...data });
  };

  useEffect(() => {
    setData({ tags, facts });
  }, [tags, facts, setData]);

  return (
    <TagsProvider value={tags}>
      <Layout facts={facts} onCreateTag={handleCreateTag} onCreateFact={handleCreateFact} />
    </TagsProvider>
  );
};

export default App;
