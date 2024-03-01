import React, { useState } from 'react';
import './App.css';
import Tabel from './Components/Tabel';
import EditTabel from './Components/EditTabel';

function App() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Add save logic here if needed
  };

  return (
    <div className='  px-12 py-32'>
      {isEditing ? (
        <EditTabel onSaveClick={handleSaveClick} />
      ) : (
        <Tabel onEditClick={handleEditClick} />
      )}
    </div>
  );
}

export default App;
