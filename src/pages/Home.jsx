import Sidebar from "./Sidebar";

/**
 * Home page component.
 * 
 * This component represents the main layout after a user logs in.
 * It includes a sidebar for navigation and a main content area.
 */
export default function Home() {
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area*/}
      <div style={{ padding: "20px", flex: 1 }}>
        <h1>AdoptaPet</h1>
      </div>

    </div>
  );
}