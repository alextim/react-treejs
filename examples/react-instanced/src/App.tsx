import { useRef, useEffect } from 'react';

import { options } from '@/at-shared';

import { useAppStore } from './store';

import Layout from './components/Layout/Layout';
import Content3D from './components/3d/Content3D';
import { BoxesHandlers } from './components/3d/InstancedBoxes';
import Aside from './components/Aside';

const App = () => {
  const boxesRef = useRef<BoxesHandlers>(null);

  const actions = useAppStore(({ actions }) => actions);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);

  useEffect(() => {
    actions.loadAsync();
  }, []);

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  const toggleSelection = (id: number | undefined) => {
    actions.selection.toggle(id);
  };

  const deleteItem = (id: number | undefined) => {
    if (id !== undefined) {
      actions.remove(id)
      // boxesRef.current?.updateAll();
    }
  };
//

  return (
    <Layout aside={< Aside />}>
      <Content3D ref={boxesRef} linesColor={options.edgeColor} onClick={toggleSelection} />
    </Layout>
  );

};

export default App;
