import { useRef, useEffect } from 'react';

import { options } from '@/at-shared';

import { useAppStore } from './store';

import Layout from './components/Layout/Layout';
import Content3D from './components/3d/Content3D';
import { BoxesHandlers } from './components/3d/InstancedBoxes';
import Aside from './components/Aside';
import CircularProgressBar from './components/CircularProgressBar';

const App = () => {
  const boxesRef = useRef<BoxesHandlers>(null);

  const loadLines = useAppStore(({ loadLines }) => loadLines);
  const loadItems = useAppStore(({ loadItems }) => loadItems);
  const error = useAppStore(({ error }) => error);
  const selection = useAppStore(({ selection }) => selection);
  const remove = useAppStore(({ remove }) => remove);

  const progressIndicator = useAppStore(({ progressIndicator }) => progressIndicator);
  const itemsLoading = useAppStore(({ itemsLoading }) => itemsLoading);
  const linesLoading = useAppStore(({ linesLoading }) => linesLoading);


  useEffect(() => {
    loadLines();
    loadItems();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }


  const toggleSelection = (id: number | undefined) => {
    selection.toggle(id);
  };

  const deleteItem = (id: number | undefined) => {
    if (id !== undefined) {
      remove(id)
      // boxesRef.current?.updateAll();
    }
  };

  return (
    <Layout aside={< Aside />}>
      { !itemsLoading && !linesLoading ? (
        <Content3D ref={boxesRef} linesColor={options.edgeColor} onClick={toggleSelection} />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgressBar
            maxValue={100}
              selectedValue={(Math.floor(progressIndicator * 100))}
              selectedText="%"

            label="Loading"
            textColor="#f00"
            radius={100}
            activeStrokeColor="#cc6600"
            withGradient
          />
        </div>
       )}
    </Layout>
  );

};

export default App;
