import React from 'react';
import { PoolakiProvider, usePoolaki } from './context/PoolakiContext';
import MobileFrame from './components/MobileFrame';
import HomeView from './components/HomeView';
import AssetsView from './components/AssetsView';
import ReportsView from './components/ReportsView';
import BudgetView from './components/BudgetView';
import DuesView from './components/DuesView';

// Modals
import NewTransactionModal from './components/NewTransactionModal';
import CategoryPickerModal from './components/CategoryPickerModal';
import CategoriesView from './components/CategoriesView';
import EditCategoryModal from './components/EditCategoryModal';
import EditAccountModal from './components/EditAccountModal';
import SmsPermissionModal from './components/SmsPermissionModal';
import SmsSimulatorModal from './components/SmsSimulatorModal';
import DataManagementModal from './components/DataManagementModal';

// Advanced JeebYar & Update Modals
import BatchSmsModal from './components/BatchSmsModal';
import SubscriptionModal from './components/SubscriptionModal';
import AssetValuationModal from './components/AssetValuationModal';
import ReceiptScannerModal from './components/ReceiptScannerModal';
import SplitBillModal from './components/SplitBillModal';

function MainScreen() {
  const { activeTab } = usePoolaki();

  const renderCurrentTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'assets':
        return <AssetsView />;
      case 'reports':
        return <ReportsView />;
      case 'budget':
        return <BudgetView />;
      case 'dues':
        return <DuesView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <MobileFrame>
      {renderCurrentTab()}

      {/* Core Poolaki Modals & Drawers */}
      <NewTransactionModal />
      <CategoryPickerModal />
      <CategoriesView />
      <EditCategoryModal />
      <EditAccountModal />
      <SmsPermissionModal />
      <SmsSimulatorModal />
      <DataManagementModal />

      {/* Advanced JeebYar Super-App Modals */}
      <BatchSmsModal />
      <SubscriptionModal />
      <AssetValuationModal />
      <ReceiptScannerModal />
      <SplitBillModal />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <PoolakiProvider>
      <MainScreen />
    </PoolakiProvider>
  );
}

