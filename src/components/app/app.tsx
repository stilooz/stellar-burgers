import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';

const App = () => (
  <div className={styles.app}>
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
//tets
