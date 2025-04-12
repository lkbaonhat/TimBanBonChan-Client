import HeaderAuth from "./HeaderAuth/HeaderAuth";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import ROUTES from "@/constants/routes";

type NavigationItem = {
  label: string;
  href: string;
};

type HeaderProps = {
  items?: NavigationItem[];
};

function Header({ items }: HeaderProps) {
  return (
    <header className={styles.header}>
      {/* Logo Section */}
      <div className={styles.logo}>
        <Link className={styles.itemsLink} to={ROUTES.PUBLIC.HOME}>
          <img src={} alt="TimBanBonChan_Logo" />
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className={styles.navigation}>
        {items?.map((item) => (
          <Link key={item.label} to={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      {/* <div className={styles.userSection}>
        <HeaderAuth user={user} onLogout={handleLogout} />
      </div> */}
    </header>
  );
}

export default Header;
