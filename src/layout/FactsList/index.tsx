import React from 'react';

import { Fact } from '../../types/Fact';
import FactItem from './FactItem';

type FactsListProps = {
  facts: Fact[];
};

const FactsList: React.FC<FactsListProps> = ({ facts }) => {
  return (
    <>
      {facts.map((fact) => (
        <FactItem key={fact.id} fact={fact} />
      ))}
    </>
  );
};

export default FactsList;
