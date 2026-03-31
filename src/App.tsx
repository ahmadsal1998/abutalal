import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppDataProvider } from '@/contexts/AppDataContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SitePagesProvider } from '@/contexts/SitePagesContext'
import { StoreThemeProvider } from '@/contexts/StoreThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { POSProvider } from '@/contexts/POSContext'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { StoreLayout } from '@/layouts/StoreLayout'
import { POSLayout } from '@/layouts/POSLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { HomePage } from '@/pages/storefront/HomePage'
import { ProductListPage } from '@/pages/storefront/ProductListPage'
import { ProductDetailPage } from '@/pages/storefront/ProductDetailPage'
import { CartPage } from '@/pages/storefront/CartPage'
import { CheckoutPage } from '@/pages/storefront/CheckoutPage'
import { POSPage } from '@/pages/pos/POSPage'
import { LoginPage } from '@/pages/admin/LoginPage'
import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminInventoryPage } from '@/pages/admin/AdminInventoryPage'
import { AdminReportsPage } from '@/pages/admin/AdminReportsPage'
import { AdminCustomersPage } from '@/pages/admin/AdminCustomersPage'
import { AdminSalesPage } from '@/pages/admin/AdminSalesPage'
import { AdminExpensesPage } from '@/pages/admin/AdminExpensesPage'
import { AdminStoreDesignPage } from '@/pages/admin/AdminStoreDesignPage'
import { AdminSitePagesPage } from '@/pages/admin/AdminSitePagesPage'
import { SitePageView } from '@/pages/storefront/SitePageView'
import { StoreOrdersPage } from '@/pages/storefront/StoreOrdersPage'
import { StoreAccountPage } from '@/pages/storefront/StoreAccountPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <SitePagesProvider>
            <StoreThemeProvider>
              <CartProvider>
                <Routes>
                  <Route element={<StoreLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListPage />} />
                    <Route path="/products/:slug" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<StoreOrdersPage />} />
                    <Route path="/account" element={<StoreAccountPage />} />
                    <Route path="/page/:slug" element={<SitePageView />} />
                  </Route>

                <Route path="/admin/login" element={<LoginPage />} />

                <Route element={<RequireAuth />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminOverviewPage />} />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route path="inventory" element={<AdminInventoryPage />} />
                    <Route path="reports" element={<AdminReportsPage />} />
                    <Route path="sales" element={<AdminSalesPage />} />
                    <Route path="expenses" element={<AdminExpensesPage />} />
                    <Route
                      path="store-design"
                      element={<AdminStoreDesignPage />}
                    />
                    <Route path="site-pages" element={<AdminSitePagesPage />} />
                    <Route path="customers" element={<AdminCustomersPage />} />
                    <Route
                      path="pos"
                      element={
                        <POSProvider>
                          <POSLayout />
                        </POSProvider>
                      }
                    >
                      <Route index element={<POSPage />} />
                    </Route>
                  </Route>
                </Route>

                <Route
                  path="/pos"
                  element={<Navigate to="/admin/pos" replace />}
                />

                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </CartProvider>
            </StoreThemeProvider>
          </SitePagesProvider>
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
