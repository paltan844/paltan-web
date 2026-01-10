
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import Navigation from "./src/navigation/Navigation.web";

const App = () => {
  return (
    <HelmetProvider>
      <div style={styles.container}>
        <Navigation />
      </div>
    </HelmetProvider>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", backgroundColor: "#fff" },
};

export default App;
