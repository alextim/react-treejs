import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children?: React.ReactNode;
  aside?: React.ReactNode;
};

const Layout = ({ children, aside }: Props) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        {children}
      </main>
      <aside className="app-aside">{aside}</aside>
      <Footer />
    </div>
  );
};

export default Layout;
