import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { clearAdminAuth, getAdminAuth } from '@/lib/auth';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  AdminCategoriesTab,
  AdminDashboardSkeleton,
  AdminHeader,
  AdminOverviewTab,
  AdminProductsTab,
  AdminPurchasesTab,
  AdminTeamsTab
} from './components';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAdminAuth());
  const [tabsOpen, setTabsOpen] = useState(false);

  const categories = useQuery(api.categories.listForAdmin);
  const products = useQuery(api.products.listForAdmin);
  const purchases = useQuery(api.purchases.getAll);
  const teams = useQuery(api.teams.listForAdmin);

  useEffect(() => {
    if (!getAdminAuth()) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    clearAdminAuth();
    navigate('/admin/login');
  };

  const isLoading =
    categories === undefined ||
    products === undefined ||
    purchases === undefined ||
    teams === undefined;

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={handleLogout} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            setTabsOpen(false);
          }}
        >
          <div className="mb-10">
            <Button
              className="flex w-full items-center justify-between md:hidden min-h-[44px]"
              onClick={() => setTabsOpen((o) => !o)}
              type="button"
              variant="outline"
            >
              <span className="font-semibold">
                {activeTab === 'overview' && 'Übersicht'}
                {activeTab === 'teams' && 'Teams'}
                {activeTab === 'products' && 'Produktverwaltung'}
                {activeTab === 'categories' && 'Kategorieverwaltung'}
                {activeTab === 'purchases' && 'Kaufhistorie'}
              </span>
              {tabsOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
            <div className={tabsOpen ? 'block' : 'hidden md:block'}>
              <TabsList className="grid w-full grid-cols-1 h-auto gap-1 p-2 md:grid-cols-5 mt-2 md:mt-0">
                <TabsTrigger className="min-h-[44px] text-sm font-semibold" value="overview">
                  Übersicht
                </TabsTrigger>
                <TabsTrigger className="min-h-[44px] text-sm font-semibold" value="teams">
                  Teams
                </TabsTrigger>
                <TabsTrigger className="min-h-[44px] text-sm font-semibold" value="products">
                  Produktverwaltung
                </TabsTrigger>
                <TabsTrigger className="min-h-[44px] text-sm font-semibold" value="categories">
                  Kategorieverwaltung
                </TabsTrigger>
                <TabsTrigger className="min-h-[44px] text-sm font-semibold" value="purchases">
                  Kaufhistorie
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent className="space-y-6" value="overview">
            <AdminOverviewTab />
          </TabsContent>

          <TabsContent className="space-y-6" value="teams">
            <AdminTeamsTab />
          </TabsContent>

          <TabsContent className="space-y-6" value="products">
            <AdminProductsTab />
          </TabsContent>

          <TabsContent className="space-y-6" value="categories">
            <AdminCategoriesTab />
          </TabsContent>

          <TabsContent className="space-y-6" value="purchases">
            <AdminPurchasesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
