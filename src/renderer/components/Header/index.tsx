import { Link } from 'react-router-dom';

import { useAuth } from '../../contexts/authContext';
import styles from './styles.module.scss';

import logoImg from '../../../../assets/logo.png';

const { ipcRenderer } = window.require('electron');

type Props = {
  isGoBack?: boolean;
};

export function Header({ isGoBack = false }: Props) {
  const { signOut } = useAuth();

  function handleRefreshHistory() {
    ipcRenderer.send('list');
    alert('Requisição enviada!');
  }

  return (
    <header className={styles.headerContainer}>
      <div className={styles.image}>
        <Link to="/" onClick={signOut}>
          <img width={100} height={100} src={logoImg} alt="Logo" />
        </Link>
      </div>

      <nav>
        <button
          onClick={handleRefreshHistory}
          className={styles.button}
          type="button"
        >
          Atualizar histórico
        </button>

        {isGoBack ? (
          <Link className={styles.link} to="/home">
            Voltar
          </Link>
        ) : (
          <Link className={styles.link} to="/live">
            Próximas apostas
          </Link>
        )}
      </nav>
    </header>
  );
}
