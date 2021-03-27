import React, { useMemo, useState } from 'react';

import { Row } from 'react-bootstrap';

import { useTags } from '../contexts/TagsProvider';
import { Tag, TagData } from '../types/Tag';
import Autocomplete from './Autocomplete';

export type TagItemProps = {
  tag: Omit<TagData, 'id'>;
  onClick?: () => void;
};

export const TagItem: React.FC<TagItemProps> = ({ tag, onClick }) => (
  <span
    style={{
      background: tag.color,
      color: tag.textColor === 'dark' ? '#444' : '#EEE',
      padding: '0 6px',
      margin: '0 4px',
      borderRadius: 4,
      fontWeight: 'bold',
      fontSize: 11,
      cursor: onClick ? 'pointer' : 'initial',
    }}
    onClick={onClick}
  >
    {tag.text}
  </span>
);

type TagsListProps = {
  tags: Tag[];
  onToggle: (tag: Tag) => void;
};

const TagsList: React.FC<TagsListProps> = ({ tags, onToggle }) => {
  const [adding, setAdding] = useState(false);
  const allTags = useTags();
  const [value, setValue] = useState('');
  const options = useMemo(() => allTags.map(({ text }) => text), [allTags]);

  const toggleTag = (text: string) => {
    const tag = allTags.find(t => t.text === text);

    if (tag) {
      onToggle(tag);
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        if (value === '' && tags.length > 0) {
          onToggle(tags[tags.length - 1]);
        }
        break;

      case 'Escape':
        setValue('');
        setAdding(false);
        break;

      case 'Enter':
      case 'Tab':
        toggleTag(e.currentTarget.value);
        break;
    }
  };

  return (
    <Row>
      {tags.map((tag) => (
        <TagItem tag={tag} key={tag.text} />
      ))}
      {!adding && <TagItem tag={{ id: '', text: '+', color: '#EEE', textColor: 'dark' }} onClick={() => setAdding(true)} />}
      {adding && (
        <Autocomplete
          autoFocus
          value={value}
          onChange={e => setValue(e.currentTarget.value)}
          options={options}
          style={{ fontSize: 11, padding: 0, margin: 0, border: 0, background: 'transparent' }}
          onBlur={() => setAdding(false)}
          onKeyDown={handleKeyDown}
        />
      )}
    </Row>
  );
};

export default TagsList;
