import Sidebar from "./Sidebar";

export default function Home() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>Home</h1>
        <p>Bienvenido 👋</p>
      </div>

    </div>
  );
}