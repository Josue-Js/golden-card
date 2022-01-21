import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';
import { useCart } from '../../hooks/useCart';

import styles from './styles.module.scss';


export function Header() {

  const { lenCart } = useCart();


  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a className={styles.logo}>
            <img src="/logo.png" alt="logo" />
            <h2>golden card</h2>
          </a>
        </Link>

        <div className={styles.cartIcon}>
          <Link href="/cart">
            <a>
              <AiOutlineShopping size={24} color="#F9F9F9" />
              {lenCart != 0 &&
                <span className={styles.NumberItemInCart}>
                  {lenCart}
                </span>
              }
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}