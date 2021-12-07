import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { api } from '../../services/api';

import { Header } from '../components/Header';
import styles from '../styles/pages/home.module.scss';

const { ipcRenderer } = window.require('electron');

type Inputs = {
  url: string;
};

export function Home() {
  const [name, setName] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ url }) => {
    ipcRenderer.send('replicate', { url, name });
    await api.post('emmit/repass', {
      url,
      name,
    });
    alert('Solicitação enviada');
  };

  return (
    <div className={styles.container}>
      <Header />

      <main>
        <h2>Digite as informações da aposta AO VIVO</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          <input
            placeholder="Link da aposta"
            {...register('url', {
              required: { value: true, message: 'Url obrigatória!' },
              pattern: {
                value: /(https?:\/\/[^\s]+)/g,
                message: 'Digite uma url',
              },
            })}
          />
          {errors.url && <span>{errors.url.message}</span>}

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Resultado final</h2>

            <button
              onClick={() => setName('Resultado Final - Mandante')}
              className={
                name === 'Resultado Final - Mandante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante
            </button>
            <button
              onClick={() => setName('Resultado Final - Empate')}
              className={
                name === 'Resultado Final - Empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate
            </button>
            <button
              onClick={() => setName('Resultado Final - Visitante')}
              className={
                name === 'Resultado Final - Visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Visitante
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Dupla Hipótese</h2>

            <button
              onClick={() => setName('Dupla Hipótese - Mandante ou empate')}
              className={
                name === 'Dupla Hipótese - Mandante ou empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante ou empate
            </button>
            <button
              onClick={() => setName('Dupla Hipótese - Empate ou visitante')}
              className={
                name === 'Dupla Hipótese - Empate ou visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate ou visitante
            </button>
            <button
              onClick={() => setName('Dupla Hipótese - Mandante ou visitante')}
              className={
                name === 'Dupla Hipótese - Mandante ou visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante ou visitante
            </button>
          </div>

          <button type="submit">Replicar</button>
        </form>
      </main>
    </div>
  );
}
