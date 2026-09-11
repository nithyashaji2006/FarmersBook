import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <>
      <Navbar />

      <main className="page-container">
        {children}
      </main>
    </>
  );
}

export default Layout;