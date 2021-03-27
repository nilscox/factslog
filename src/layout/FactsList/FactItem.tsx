import React, { useState } from 'react';

import IconDelete from 'bootstrap-icons/icons/trash.svg';
import { format } from 'date-fns';
import { Col, Row } from 'react-bootstrap';

import TagsList from '../../components/TagsList';
import { Fact } from '../../types/Fact';
import { Tag } from '../../types/Tag';

type FactItemTextProps = {
  text: string;
  onUpdate: (text: string) => void;
};

const FactItemText: React.FC<FactItemTextProps> = ({ text, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  const handleBlur = () => {
    onUpdate(value);
    setEditing(false);
  };

  return (
    <>
      {editing && (
        <input
          autoFocus
          style={{ width: '100%', margin: 0, padding: 0, border: 0, background: 'transparent' }}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onBlur={handleBlur}
        />
      )}
      <div onClick={() => setEditing(true)}>{!editing && text}</div>
    </>
  );
};

type FactItemDateProps = {
  date: Date;
  onUpdate: (date: Date) => void;
};

const FactItemDate: React.FC<FactItemDateProps> = ({ date, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(format(date, 'yyyy-MM-dd'));

  const handleBlur = () => {
    onUpdate(new Date(value));
    setEditing(false);
  };

  return (
    <>
      {editing && (
        <input
          autoFocus
          type="date"
          value={value}
          style={{ maxWidth: 120, margin: 0, padding: 0, border: 0, background: 'transparent', fontSize: 12 }}
          onChange={(e) => setValue(e.currentTarget.value)}
          onBlur={handleBlur}
        />
      )}
      {!editing && (
        <small title={format(date, 'yyyy-MM-dd HH:mm')} onClick={() => setEditing(true)}>
          {format(date, 'yyyy-MM-dd')}
        </small>
      )}
    </>
  );
};

type FactItemProps = {
  fact: Fact;
};

const FactItem: React.FC<FactItemProps> = ({ fact }) => {
  const [hover, setHover] = useState(false);

  const handleToggleTag = (tag: Tag) => {
    if (fact.getTags().includes(tag)) {
      fact.removeTag(tag);
    } else {
      fact.addTag(tag);
    }
  };

  const handleRemove = (fact: Fact) => {
    if (confirm('WTF?! Delete this fact forever?\n\n' + fact.text)) {
      fact.remove();
    }
  };

  return (
    <Row
      style={{ margin: '16px 0', alignItems: 'center', backgroundColor: hover ? '#F9F9F9' : 'transparent' }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Col>
        <Row style={{ alignItems: 'center' }}>
          <Col sm="auto">
            <FactItemDate date={fact.date} onUpdate={(date) => fact.update({ date })} />
          </Col>
          <Col>
            <TagsList tags={fact.getTags()} onToggle={handleToggleTag} />
          </Col>
        </Row>
        <Row>
          <Col className="lead">
            <FactItemText text={fact.text} onUpdate={(text) => fact.update({ text })} />
          </Col>
        </Row>
        <Row></Row>
      </Col>
      <Col xs={1}>
        <Row style={{ justifyContent: 'center', visibility: hover ? 'visible' : 'hidden' }}>
          <IconDelete style={{ color: '#D42', cursor: 'pointer' }} onClick={() => handleRemove(fact)} />
        </Row>
      </Col>
    </Row>
  );
};

export default FactItem;
