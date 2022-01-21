import Image from 'next/image';
import { HTMLAttributes } from 'react';
import styles from './styles.module.scss'

type IProduct = {
  product_id: string;
  price_id: string;
  title: string;
  price: string;
  image: string;
  rating: number;
}

type Props = HTMLAttributes<HTMLDivElement> & {
  product: IProduct
}

export function Card({ product, ...rest }: Props) {

  return (
    <div className={styles.card} {...rest}>
      <figure className={styles.image}>
        <Image
          src={product.image}
          layout="fill"
        />
      </figure>

      <div className={styles.cardInfo}>
        <p className={styles.title}>
          {product.title}
        </p>
        <span className={styles.price}>
          R$ {product.price}
        </span>
      </div>
    </div>
  );
}