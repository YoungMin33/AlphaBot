import React, { useState } from 'react';
import styled from 'styled-components';
import ChatArea from '../components/ChatArea';
import StockSearch from '../components/StockSearch';
import LeftSidebar from '../components/LeftSidebar';
import RightMenu from '../components/RightMenu';

interface Stock {
  code: string;
  name: string;
  exchange: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

const ChatPage: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <Container>
      <ChatHeader>
        <HeaderContent>
          <Logo>
            <LogoIcon>💼</LogoIcon>
            <LogoText>Alpha Bot</LogoText>
          </Logo>
          
          <SearchWrapper>
            <StockSearch onSelectStock={handleSelectStock} />
          </SearchWrapper>

          {selectedStock && (
            <SelectedStockInfo>
              <StockBadge>
                <StockCode>{selectedStock.code}</StockCode>
                <StockName>{selectedStock.name}</StockName>
              </StockBadge>
              <ClearButton onClick={() => setSelectedStock(null)} title="종목 선택 해제">
                ✕
              </ClearButton>
            </SelectedStockInfo>
          )}
        </HeaderContent>
      </ChatHeader>

      <MainContent>
        <LeftSidebar />
        <ChatArea stockCode={selectedStock?.code} />
        <RightMenu onSelectStock={handleSelectStock} />
      </MainContent>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f7f8;
`;

const ChatHeader = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 12px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const LogoIcon = styled.span`
  font-size: 24px;
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #202123;
`;

const SearchWrapper = styled.div`
  flex: 1;
  max-width: 600px;
`;

const SelectedStockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f7ff;
  border: 1px solid #d0e7ff;
  border-radius: 8px;
  flex-shrink: 0;
`;

const StockBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StockCode = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #4169e1;
`;

const StockName = styled.span`
  font-size: 13px;
  color: #565869;
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #8e8ea0;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: #e5e5e5;
    color: #565869;
  }
`;

const MainContent = styled.main`
  flex: 1;
  overflow: hidden;
  display: flex;
  width: 100%;
`;

export default ChatPage;
