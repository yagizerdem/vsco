const { useContext, createContext, useState } = require("react");

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [visitor, setVisitor] = useState(null);

  return (
    <AppContext.Provider value={{ visitor, setVisitor }}>
      {children}
    </AppContext.Provider>
  );
};

export default function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
}
