import React, { useState } from 'react';

import { isAfter, isBefore, parseISO } from 'date-fns';
import { Col, Container, Row } from 'react-bootstrap';

import { Fact } from '../types/Fact';
import { TagData } from '../types/Tag';
import FactsList from './FactsList';
import Header from './Header';
import TagsModal from './TagsModal';

type Filter<T = string> = (query: string) => [string, T] | undefined;

const useFactsList = (facts: Fact[]) => {
  const getSort: Filter<'asc' | 'desc'> = (query) => {
    const sort = query.match(/sort:(asc|desc)/);

    if (sort) {
      return [sort[0], sort[1] as 'asc' | 'desc'];
    }
  };

  const getFrom: Filter<Date> = (query) => {
    const from = query.match(/from:([^ ]{4,})/);

    if (from) {
      const date = parseISO(from[1]);

      if (date) {
        return [from[0], date];
      }
    }
  };

  const getTo: Filter<Date> = (query) => {
    const to = query.match(/to:([^ ]{4,})/);

    if (to) {
      const date = parseISO(to[1]);

      if (date) {
        return [to[0], date];
      }
    }
  };

  const getTag: Filter = (query) => {
    const tag = query.match(/tag:([^ ]+)/);

    if (tag) {
      return [tag[0], tag[1]];
    }
  };

  const getFilterFunc = (from?: Date, to?: Date, tag?: string, search?: RegExp) => {
    return (fact: Fact) => {
      if (from && isBefore(fact.date, from)) {
        return false;
      }

      if (to && isAfter(fact.date, to)) {
        return false;
      }

      if (tag && !fact.getTags().find((t) => t.text === tag)) {
        return false;
      }

      if (search) {
        return !!search.exec(fact.text);
      }

      return true;
    };
  };

  const getSortFunc = (sort: 'asc' | 'desc') => {
    return sort === 'asc'
      ? ({ date: a }: Fact, { date: b }: Fact) => a.getTime() - b.getTime()
      : ({ date: a }: Fact, { date: b }: Fact) => b.getTime() - a.getTime();
  };

  return (search: string) => {
    const sort = getSort(search);
    const from = getFrom(search);
    const to = getTo(search);
    const tag = getTag(search);

    for (const match of [sort, from, to, tag]) {
      if (match) {
        search = search.replace(match[0], '');
      }
    }

    search = search.trim();

    const sortFunc = getSortFunc(sort?.[1] || 'desc');
    const filterFunc = getFilterFunc(from?.[1], to?.[1], tag?.[1], search ? new RegExp(search) : undefined);

    return facts
      .filter(filterFunc)
      .sort(sortFunc);
  };
};

const EditTagsButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <small role="button" className="font-size-small text-uppercase font-weight-bold text-muted" onClick={onClick}>
    Edit tags
  </small>
);

type LayoutProps = {
  facts: Fact[];
  onCreateTag: (data: Omit<TagData, 'id'>) => void;
  onCreateFact: (text: string) => void;
};

const Layout: React.FC<LayoutProps> = ({ facts, onCreateTag, onCreateFact }) => {
  const [search, setSearch] = useState<string>();
  const [showTagsModal, setShowTagsModal] = useState(false);
  const getFacts = useFactsList(facts);

  return (
    <>
      <TagsModal show={showTagsModal} onHide={() => setShowTagsModal(false)} onCreate={onCreateTag} />
      <Container fluid="md">
        <Header onSearch={setSearch} onCreate={onCreateFact} />
        <Row className="justify-content-end">
          <Col xs="auto">
            <EditTagsButton onClick={() => setShowTagsModal(true)} />
          </Col>
        </Row>
        <FactsList facts={getFacts(search || '')} />
      </Container>
    </>
  );
};

export default Layout;
