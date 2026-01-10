
import React from "react";
import Navigation from "./src/navigation/Navigation.web";

const App = () => {
  return (
    
      <div style={styles.container}>
        <Navigation />
      </div>
    
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", backgroundColor: "#fff" },
};

export default App;
