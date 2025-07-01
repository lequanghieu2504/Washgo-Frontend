import "./App.css";
import { Routes } from "react-router-dom";
import UserRoute from "@/routes/UserRoute";
import ClientRoute from "@/routes/ClientRoute";
import OwnerRoute from "./routes/OwnerRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {UserRoute()}
        {ClientRoute()}
        {OwnerRoute()}
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
