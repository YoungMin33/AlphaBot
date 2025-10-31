// src/App.tsx

import React from 'react';
import Button from './Button/Button'; 
import { FaBars, FaHistory, FaTrash } from 'react-icons/fa'; 

function App() {
  const handleButtonClick = (buttonName: string) => {
    alert(`${buttonName} 버튼 클릭!`);
    console.log(`${buttonName} 버튼이 클릭되었습니다.`);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      
      <Button 
        variant="primary" 
        size="medium" 
        onClick={() => handleButtonClick('카테고리')}
      >
        <FaBars /> 카테고리
      </Button>
      
      <Button 
        variant="secondary" 
        size="medium" 
        onClick={() => handleButtonClick('채팅 기록')}
      >
        <FaHistory /> 채팅 기록
      </Button>
      
      <Button 
        variant="ghost" 
        size="medium" 
        onClick={() => handleButtonClick('휴지통')}
      >
        <FaTrash /> 휴지통
      </Button>

    </div>
  );
}

export default App;