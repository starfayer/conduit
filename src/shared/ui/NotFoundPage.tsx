export const NotFoundPage = ({target = "Page"}: {target?: string}) => (
  <div className="home-page">
      <div className="banner" style={{textAlign: "center"}}>
        <h1>404: {target} not found</h1>
      </div>
  </div>
)