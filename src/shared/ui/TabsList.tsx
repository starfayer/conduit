interface TabProps {
  tabs: string[] | undefined,
  activeTab: string | undefined, 
  setActiveTab: (activeTab: string) => any | undefined,
}

export function TabsList({tabs, activeTab, setActiveTab}: TabProps) {
  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {tabs?.map(tabName => 
          <li key={tabName} className="nav-item">
            <a className={`nav-link ${activeTab === tabName ? "active" : ""}`} onClick={(e) => {
              e.preventDefault();
              setActiveTab(tabName);
            }}>
              {tabName}
            </a>
          </li>        
        )}
      </ul>
    </div>
  )
}