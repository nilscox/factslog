import React, { useEffect, useState } from 'react';

import { Col, Form, Modal } from 'react-bootstrap';

import { TagItem as TagListItem } from '../components/TagsList';
import { useTags } from '../contexts/TagsProvider';
import { Tag, TagData } from '../types/Tag';

const isColor = (str: string) => !!/^#[0-9A-F]{6}$/.exec(str);

type TagItemProps = {
  tag?: TagData;
  onChange?: (tag: Omit<TagData, 'id'>) => void;
  onSubmit?: (tag: Omit<TagData, 'id'>) => void;
};

const TagItem: React.FC<TagItemProps> = ({ tag, onChange, onSubmit }) => {
  const [text, setText] = useState(tag?.text || '');
  const [color, setColor] = useState(tag?.color || '');
  const [textColor, setTextColor] = useState<TagData['textColor']>(tag?.textColor || 'dark');

  useEffect(() => {
    if (!tag || text !== tag.text || color !== tag.color || textColor !== tag.textColor) {
      onChange?.({ text, color, textColor });
    }
  }, [tag, text, color, textColor, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({ text, color, textColor });
      setText('');
      setColor('');
      setTextColor('dark');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row style={{ alignItems: 'center' }}>
        <Col xs="4">
          <Form.Control
            value={text}
            placeholder={!tag ? 'New tag...' : undefined}
            style={{ width: '100%', margin: 0, padding: 0, border: 'none' }}
            onChange={(e) => setText(e.currentTarget.value.trim())}
          />
        </Col>
        <Col xs="4">
          <Form.Control
            value={color}
            style={{ width: '100%', margin: 0, padding: 0, border: 'none' }}
            onChange={(e) => setColor(e.currentTarget.value.trim())}
          />
        </Col>
        <Col xs="4">
          <TagListItem
            tag={{ text, color, textColor }}
            onClick={() => setTextColor(textColor === 'dark' ? 'light' : 'dark')}
          />
        </Col>
        <button type="submit" style={{ display: 'none' }} />
      </Form.Row>
    </Form>
  );
};

type TagsModalProps = {
  show: boolean;
  onHide: () => void;
  onCreate: (data: Omit<TagData, 'id'>) => void;
};

const TagsModal: React.FC<TagsModalProps> = ({ show, onHide, onCreate }) => {
  const tags = useTags();

  const handleChange = (tag: Tag) => (data: Omit<TagData, 'id'>) => {
    if (isColor(data.color)) {
      tag.update(data);
    }
  };

  const handleSubmit = (data: Omit<TagData, 'id'>) => {
    if (isColor(data.color)) {
      onCreate(data);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Tags</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form></Form>
        {tags.map((tag) => (
          <TagItem key={tag.id} tag={tag} onChange={handleChange(tag)} />
        ))}
        <TagItem onSubmit={handleSubmit} />
      </Modal.Body>
    </Modal>
  );
};

export default TagsModal;
