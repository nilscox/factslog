import React from 'react';

import IconAdd from 'bootstrap-icons/icons/plus.svg';
import IconSearch from 'bootstrap-icons/icons/search.svg';
import { Button, Col, Form, InputGroup, Jumbotron, Row } from 'react-bootstrap';

import image from './image.jpg';

type InputFieldProps = {
  onSearch: (text?: string) => void;
  onCreate: (text: string) => void;
};

const InputField: React.FC<InputFieldProps> = ({ onSearch, onCreate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.currentTarget.value.trim() || undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onCreate(e.currentTarget.value.trim());
      e.currentTarget.value = '';
      onSearch();
    }
  };

  return (
    <>
      <InputGroup>
        <InputGroup.Prepend>
          <Button variant="success" style={{ padding: '0 8px' }}>
            <IconAdd fontSize="26" />
          </Button>
        </InputGroup.Prepend>
        <Form.Control onChange={handleChange} onKeyPress={handleKeyPress} />
        <InputGroup.Append>
          <Button style={{ padding: '0 16px' }}>
            <IconSearch />
          </Button>
        </InputGroup.Append>
      </InputGroup>
      <Form.Text style={{ color: '#CCC' }}>Ctrl+Enter to create</Form.Text>
    </>
  );
};

type HeaderProps = {
  onSearch: (text?: string) => void;
  onCreate: (text: string) => void;
};

const Header: React.FC<HeaderProps> = ({ onSearch, onCreate }) => {
  return (
    <Jumbotron style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center', margin: 0 }}>
      <h1 style={{ color: 'white' }}>Log or search a fact!</h1>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Row>
          <Col style={{ marginBottom: 16 }}>
            <InputField onSearch={onSearch} onCreate={onCreate} />
          </Col>
        </Row>
      </Form>
    </Jumbotron>
  );
};

export default Header;
