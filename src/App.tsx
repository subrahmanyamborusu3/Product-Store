
import { useState } from 'react';
import ProductManagement from './components/ProductManagement';
import HomePage from './components/Home';
import FavoritesPage from './components/FavoritesPage';

type Page = 'home' | 'favorites' | 'management';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateToHome = () => setCurrentPage('home');
  const navigateToFavorites = () => setCurrentPage('favorites');
  const navigateToManagement = () => setCurrentPage('management');

  return (
    <>
      <div id="modal-root"></div>
      
      {currentPage === 'home' && (
        <HomePage 
          onViewFavorites={navigateToFavorites}
          onViewManagement={navigateToManagement}
        />
      )}
      {currentPage === 'favorites' && (
        <FavoritesPage onBack={navigateToHome} />
      )}
      {currentPage === 'management' && (
        <ProductManagement onBack={navigateToHome} />
      )}
    </>
  );
}

export default App;