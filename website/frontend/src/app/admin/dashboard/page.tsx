import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import styles from './page.module.css';

interface DashboardData {
  financials: {
    grossSales: number;
    netSales: number;
    totalDiscounts: number;
    averageOrderValue: number;
  };
  orders: {
    totalOrders: number;
    statusDistribution: Record<string, number>;
  };
  customers: {
    totalCustomers: number;
    newCustomers30Days: number;
  };
  inventory: {
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    lowStockAlerts: Array<{
      productId: string;
      name: string;
      brand: string;
      totalStock: number;
      lowStockSizes: number[];
    }>;
  };
  salesTrend: Array<{
    label: string;
    sales: number;
    orders: number;
  }>;
  topSellingProducts: Array<{
    _id: string;
    totalQtySold: number;
    totalRevenue: number;
    name: string;
    brand: string;
    price: number;
  }>;
}

export const metadata = {
  title: 'Admin Dashboard',
};

async function getDashboardData(token: string): Promise<DashboardData | null> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiBase}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store', // Always fetch fresh dashboard metrics
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('[Admin Dashboard] Fetch error:', error);
    return null;
  }
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login?redirect=/admin/dashboard');
  }

  const data = await getDashboardData(token);

  if (!data) {
    // If stats fetching fails, user is either not authorized (not admin) or backend is down
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>Access Denied</h2>
        <p className={styles.errorDesc}>
          You do not have administrative permissions to access the dashboard, or the server is temporarily unavailable.
        </p>
        <Link href="/" className={styles.btn}>
          Back to Storefront
        </Link>
      </div>
    );
  }

  // Find max sales in trend to calculate heights of SVG chart bars proportionally
  const maxSales = Math.max(...data.salesTrend.map((t) => t.sales), 1000);

  // Status mapping for progress bars
  const totalOrders = data.orders.totalOrders || 1;
  const statusLabels = {
    delivered: styles.progressDelivered,
    pending: styles.progressPending,
    confirmed: styles.progressBar,
    packed: styles.progressBar,
    shipped: styles.progressBar,
    cancelled: styles.progressCancelled,
    refunded: styles.progressRefunded,
  } as Record<string, string>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Business Overview</h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '4px' }}>
            Welcome back to the administrator dashboard panel.
          </p>
        </div>
        <span className={styles.badge}>Admin Session Active</span>
      </div>

      {/* Grid Summary Cards */}
      <div className={styles.grid}>
        {/* Gross Revenue */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Gross Sales</span>
          <span className={styles.cardValue}>₹{data.financials.grossSales.toLocaleString()}</span>
          <span className={styles.cardSub}>
            Including discounts: ₹{data.financials.totalDiscounts.toLocaleString()}
          </span>
        </div>

        {/* Net Revenue */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Net Revenue</span>
          <span className={styles.cardValue} style={{ color: '#10B981' }}>
            ₹{data.financials.netSales.toLocaleString()}
          </span>
          <span className={styles.cardSub}>Average Ticket: ₹{data.financials.averageOrderValue.toLocaleString()}</span>
        </div>

        {/* Orders Count */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total Orders</span>
          <span className={styles.cardValue}>{data.orders.totalOrders}</span>
          <span className={styles.cardSub} style={{ color: '#3B82F6' }}>
            Active checkout completions
          </span>
        </div>

        {/* Customers */}
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total Customers</span>
          <span className={styles.cardValue}>{data.customers.totalCustomers}</span>
          <span className={styles.cardSub}>
            +{data.customers.newCustomers30Days} new (last 30 days)
          </span>
        </div>
      </div>

      {/* Layout Panels */}
      <div className={styles.layoutGrid}>
        {/* Sales Trend Chart */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Revenue Performance Trend</h3>
          <div className={styles.chartContainer}>
            {data.salesTrend.map((trend, index) => {
              const heightPercentage = (trend.sales / maxSales) * 100;
              return (
                <div key={index} className={styles.chartBarCol}>
                  <div
                    className={styles.chartBar}
                    style={{ height: `${Math.max(4, heightPercentage)}%` }}
                  >
                    <div className={styles.chartTooltip}>
                      ₹{trend.sales.toLocaleString()} ({trend.orders} orders)
                    </div>
                  </div>
                  <span className={styles.chartLabel}>{trend.label}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>
            Revenue metrics are grouped dynamically by month based on verified payment invoices.
          </p>
        </div>

        {/* Order Status split */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Order Statuses</h3>
          <div className={styles.distList}>
            {Object.entries(data.orders.statusDistribution).map(([status, count]) => {
              const percentage = (count / totalOrders) * 100;
              const barClass = statusLabels[status] || styles.progressBar;
              return (
                <div key={status} className={styles.distItem}>
                  <div className={styles.distHeader}>
                    <span className={styles.distName}>{status}</span>
                    <span className={styles.distVal}>{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={`${styles.progressBar} ${barClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        {/* Top Selling Products */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Best Selling Products</h3>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Product Details</th>
                  <th className={styles.th}>Retail Price</th>
                  <th className={styles.th}>Units Sold</th>
                  <th className={styles.th}>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.topSellingProducts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.td} style={{ textAlign: 'center', color: '#9CA3AF' }}>
                      No product sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.topSellingProducts.map((p) => (
                    <tr key={p._id}>
                      <td className={styles.td}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div className={styles.tdBrand}>{p.brand}</div>
                      </td>
                      <td className={styles.td}>₹{p.price.toLocaleString()}</td>
                      <td className={styles.td} style={{ fontWeight: 600 }}>{p.totalQtySold}</td>
                      <td className={styles.td} style={{ color: '#10B981', fontWeight: 600 }}>
                        ₹{p.totalRevenue.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Inventory Alerts</h3>
          <div className={styles.alertList}>
            {/* Out of Stock overview */}
            <div
              className={styles.alertItem}
              style={{
                backgroundColor: data.inventory.outOfStock > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                borderColor: data.inventory.outOfStock > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              }}
            >
              <div className={styles.alertItemInfo}>
                <span className={styles.alertItemTitle}>Stock Status Summary</span>
                <span
                  className={styles.alertItemSub}
                  style={{ color: data.inventory.outOfStock > 0 ? '#EF4444' : '#10B981' }}
                >
                  {data.inventory.outOfStock} out-of-stock items, {data.inventory.lowStock} low stock items.
                </span>
              </div>
              <span
                className={styles.alertBadge}
                style={{
                  backgroundColor: data.inventory.outOfStock > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: data.inventory.outOfStock > 0 ? '#EF4444' : '#10B981',
                  borderColor: 'transparent',
                }}
              >
                {data.inventory.outOfStock > 0 ? 'Attention Needed' : 'Inventory Healthy'}
              </span>
            </div>

            {/* Individual low stock list */}
            {data.inventory.lowStockAlerts.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: '13px', textAlign: 'center', marginTop: '16px' }}>
                No active inventory warnings.
              </p>
            ) : (
              data.inventory.lowStockAlerts.map((alert) => (
                <div key={alert.productId} className={styles.alertItem}>
                  <div className={styles.alertItemInfo}>
                    <span className={styles.alertItemTitle}>{alert.name}</span>
                    <span className={styles.alertItemSub}>
                      {alert.brand} — {alert.totalStock === 0 ? 'Out of Stock' : `Low sizes: ${alert.lowStockSizes.join(', ')}`}
                    </span>
                  </div>
                  <span className={styles.alertBadge}>
                    {alert.totalStock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
