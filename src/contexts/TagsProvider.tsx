import React, { useContext } from 'react';

import { Tag } from '../types/Tag';

const TagsContext = React.createContext<Tag[]>([]);

export const TagsProvider = TagsContext.Provider;
export const useTags = (): Tag[] => useContext(TagsContext);
