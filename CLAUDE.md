# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
# Start development server
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Run end-to-end tests with Playwright
npm run test:e2e

# Run e2e tests in UI mode (debug)
npm run test:e2e:ui

# Show test report
npm run test:e2e:report
```

The development server runs on `http://127.0.0.1:3000` with host binding for local network access.

## Project Architecture

### Technology Stack
- **React 18** with functional components and hooks
- **Ant Design 5.3.0** as the primary UI component library
- **React Router DOM 6.8.2** for client-side routing
- **ECharts 5.6.0** for data visualization
- **Axios 1.3.4** for HTTP requests
- **Playwright** for end-to-end testing

### Project Structure
```
src/
├── components/layout/     # Layout components (AppHeader, AppSider, AppFooter)
├── pages/                # Feature modules organized by domain
│   ├── supplier/         # Supplier management
│   ├── purchase/         # Procurement (oil & non-oil goods)
│   ├── sales/           # Sales management (oil & goods)
│   ├── goods/           # Product management
│   ├── oil/             # Oil product management
│   ├── station/         # Station management (tanks, guns)
│   ├── equipment/       # Equipment management
│   ├── organization/    # Organization & role management
│   ├── member/          # Member center
│   ├── points/          # Points system
│   ├── marketing/       # Marketing campaigns
│   ├── security/        # Safety management
│   ├── analytics/       # Data analysis
│   └── report/          # Reports
├── mock/                # Mock data by module
├── utils/               # Utility functions
└── router.js           # Route definitions
```

### Component Organization
- Each feature module has its own directory under `src/pages/`
- Module structure: `index.js` (main component), `index.css` (styles), `components/` (sub-components)
- Shared components are in `src/components/`
- Mock data mirrors the page structure in `src/mock/`

## Design System & UI Guidelines

### Layout Architecture
- **Header**: Top navigation bar
- **Sidebar**: Two-level tree menu structure with Ant Design icons
- **Content**: Card-based layout with 24px padding
- **Tabs**: Large tabs with 16px bottom margin
- No breadcrumbs navigation

### Container Structure
```jsx
<div className="module-container">
  <Card>
    <Spin spinning={loading}>
      <Tabs 
        activeKey={activeTab} 
        onChange={handleTabChange}
        size="large"
        tabBarStyle={{ marginBottom: '16px' }}
      >
        {/* Content */}
      </Tabs>
    </Spin>
  </Card>
</div>
```

```css
.module-container {
  padding: 24px;
}

.module-container .ant-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
```

### Button Standards
Primary color: `#32AF50` (green), Error color: `#f5222d` (red)

**Button Types:**
- Primary actions: `type="primary"` (search, save, create)
- Secondary actions: default type (reset, cancel)  
- Danger actions: `type="primary" danger` (delete)
- Table actions: `type="primary" size="small"`

All buttons must have `border-radius: 2px`

### Form & Filter Layout
- Filter conditions in one row, buttons in next row (right-aligned)
- Use `Space` component for consistent button spacing
- Forms use responsive `Row`/`Col` grid system
- Tables support horizontal scroll with `scroll={{ x: 'max-content' }}`

### Modal Usage
- Use modals (not drawers) for create/edit/view operations
- Footer buttons: Cancel/Close (left), Save/Confirm (right, primary)

## Business Domain Knowledge

### Organization Structure
- **Company**: 江西交投化石能源公司 (Jiangxi Transportation Investment Fossil Energy Company)
- **8 Branches**: 赣中、赣东北、赣东、赣东南、赣南、赣西南、赣西、赣西北 (Central, Northeast, East, Southeast, South, Southwest, West, Northwest Gan regions)
- **Hierarchy**: Company → Branch → Service Area → Gas Station
- **Roles**: Manager levels, Business managers, Station staff (cashier, fuel attendant, safety personnel)

### Fuel Products
Standard fuel types per station: 92#, 95#, 98#, 0# (diesel), plus urea (DEF)
Each station has 8 fuel dispensers (2 per fuel grade) + 1 urea dispenser

### Module Relationships  
- **Procurement**: Oil inquiry → Procurement → Delivery management
- **Sales**: Oil/goods sales with price management and reporting
- **Inventory**: Links procurement, sales, and loss management
- **Approval workflows**: Multi-level approval for pricing, procurement applications

## Testing

### Test Structure
- Unit tests: Jest with React Testing Library
- E2E tests: Playwright with cross-browser support
- Test files organized by feature in `/tests` directory
- Mock data available for all major business entities

### Test Environment
- Dev server auto-starts for E2E tests
- Tests run on multiple browsers (Chrome, Firefox, Safari)
- Mobile viewport testing included
- Screenshots and videos captured on failure

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow Ant Design component patterns
- Maintain consistent file naming: PascalCase for components, kebab-case for directories
- CSS classes follow module naming: `.module-name-container`

### API & Data
- Mock data organized by business module in `/src/mock/`
- Use Axios for HTTP requests
- Implement loading states with Ant Design Spin component
- Follow approval workflow patterns for business processes

### State Management
- React built-in state management (useState, useEffect)
- Page-level state management
- No external state management library