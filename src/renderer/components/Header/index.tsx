import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

import logoImg from '../../../../assets/logo.png';

type Props = {
  isGoBack?: boolean;
};

export function Header({ isGoBack = false }: Props) {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.image}>
        <Link to="/home">
          <img width={100} height={100} src={logoImg} alt="Logo" />
        </Link>
      </div>

      {isGoBack ? (
        <Link className={styles.link} to="/home">
          Voltar
        </Link>
      ) : (
        <Link className={styles.link} to="/live">
          Apostas próximas
        </Link>
      )}
    </header>
  );
}
