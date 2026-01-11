
import React from "react";
import Navigation from "./src/navigation/Navigation.web";
import GA4Tracker from "./src/analytics/ga4Tracker";

const App = () => {
  return (
    
      <div style={styles.container}>
         <GA4Tracker />
        <Navigation />
      </div>
    
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", backgroundColor: "#fff" },
};

export default App;
