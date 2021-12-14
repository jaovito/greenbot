import { FormEvent, KeyboardEvent, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { api } from '../../services/api';
import { Header } from '../components/Header';
import styles from '../styles/pages/home.module.scss';

const { ipcRenderer } = window.require('electron');

type Inputs = {
  url: string;
};

export function Live() {
  const [name, setName] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
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

  function handleEnter(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      onSubmit({ url: getValues('url') });
    }
  }

  return (
    <div className={styles.container}>
      <Header isGoBack />

      <main>
        <h2>Digite as informações da aposta</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
          onKeyPress={handleEnter}
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
            <h2 className={styles.betTitle}>
              Resultado Final - Preços Ajustados
            </h2>

            <button
              onClick={() =>
                setName(
                  'Resultado Final - Preços Ajustados - Mandante ou empate'
                )
              }
              className={
                name ===
                'Resultado Final - Preços Ajustados - Mandante ou empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante ou empate
            </button>
            <button
              onClick={() =>
                setName(
                  'Resultado Final - Preços Ajustados - Empate ou visitante'
                )
              }
              className={
                name ===
                'Resultado Final - Preços Ajustados - Empate ou visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate ou visitante
            </button>
            <button
              onClick={() =>
                setName(
                  'Resultado Final - Preços Ajustados - Mandante ou visitante'
                )
              }
              className={
                name ===
                'Resultado Final - Preços Ajustados - Mandante ou visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante ou visitante
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Dupla Hipótese</h2>

            <button
              onClick={() => setName('Dupla Hipótese 1 - Mandante ou empate')}
              className={
                name === 'Dupla Hipótese 1 - Mandante ou empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante ou empate
            </button>
            <button
              onClick={() => setName('Dupla Hipótese 1 - Empate ou visitante')}
              className={
                name === 'Dupla Hipótese 1 - Empate ou visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate ou visitante
            </button>
            <button
              onClick={() =>
                setName('Dupla Hipótese 1 - Mandante ou visitante')
              }
              className={
                name === 'Dupla Hipótese 1 - Mandante ou visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante ou visitante
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Gols Mais/Menos</h2>

            <div>Opção 1</div>
            <button
              onClick={() => setName('Gols Mais/Menos - Mais de')}
              className={
                name === 'Gols Mais/Menos - Mais de'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mais de
            </button>
            <button
              onClick={() => setName('Gols Mais/Menos - Menos de')}
              className={
                name === 'Gols Mais/Menos - Menos de'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Menos de
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Para Ambos os Times Marcarem</h2>

            <button
              onClick={() => setName('Para Ambos os Times Marcarem - Sim')}
              className={
                name === 'Para Ambos os Times Marcarem - Sim'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Sim
            </button>
            <button
              onClick={() => setName('Para Ambos os Times Marcarem - Não')}
              className={
                name === 'Para Ambos os Times Marcarem - Não'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Não
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>
              Resultado/Para ambos os Times Marcarem
            </h2>

            <div>Mandante</div>

            <button
              onClick={() =>
                setName('Resultado/Para ambos os Times Marcarem - Mandante sim')
              }
              className={
                name === 'Resultado/Para ambos os Times Marcarem - Mandante sim'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Sim
            </button>
            <button
              onClick={() =>
                setName('Resultado/Para ambos os Times Marcarem - Mandante não')
              }
              className={
                name === 'Resultado/Para ambos os Times Marcarem - Mandante não'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Não
            </button>

            <div>Visitante</div>

            <button
              onClick={() =>
                setName(
                  'Resultado/Para ambos os Times Marcarem - Visitante sim'
                )
              }
              className={
                name ===
                'Resultado/Para ambos os Times Marcarem - Visitante sim'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Sim
            </button>
            <button
              onClick={() =>
                setName(
                  'Resultado/Para ambos os Times Marcarem - Visitante não'
                )
              }
              className={
                name ===
                'Resultado/Para ambos os Times Marcarem - Visitante não'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Não
            </button>

            <div>Empate</div>

            <button
              onClick={() =>
                setName('Resultado/Para ambos os Times Marcarem - Empate sim')
              }
              className={
                name === 'Resultado/Para ambos os Times Marcarem - Empate sim'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Sim
            </button>
            <button
              onClick={() =>
                setName('Resultado/Para ambos os Times Marcarem - Empate não')
              }
              className={
                name === 'Resultado/Para ambos os Times Marcarem - Empate não'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Não
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Intervalo/Final do Jogo</h2>

            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Mandante - Mandante')
              }
              className={
                name === 'Intervalo/Final do Jogo - Mandante - Mandante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante - Mandante
            </button>

            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Mandante - Empate')
              }
              className={
                name === 'Intervalo/Final do Jogo - Mandante - Empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante - Empate
            </button>
            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Mandante - Visitante')
              }
              className={
                name === 'Intervalo/Final do Jogo - Mandante - Visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante - Visitante
            </button>

            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Empate - Mandante')
              }
              className={
                name === 'Intervalo/Final do Jogo - Empate - Mandante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate - Mandante
            </button>
            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Empate - Empate')
              }
              className={
                name === 'Intervalo/Final do Jogo - Empate - Empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate - Empate
            </button>
            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Empate - Visitante')
              }
              className={
                name === 'Intervalo/Final do Jogo - Empate - Visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate - Visitante
            </button>

            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Visitante - Mandante')
              }
              className={
                name === 'Intervalo/Final do Jogo - Visitante - Mandante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Visitante - Mandante
            </button>

            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Visitante - Empate')
              }
              className={
                name === 'Intervalo/Final do Jogo - Visitante - Empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Visitante - Empate
            </button>
            <button
              onClick={() =>
                setName('Intervalo/Final do Jogo - Visitante - Visitante')
              }
              className={
                name === 'Intervalo/Final do Jogo - Visitante - Visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Visitante - Visitante
            </button>
          </div>

          <div className={styles.bet4}>
            <h2 className={styles.betTitle}>Marcadores de Gol</h2>

            <div>Opção 1</div>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 1 Primeiro')}
              className={
                name === 'Marcadores de Gol - Opção 1 Primeiro'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Primeiro
            </button>
            <button
              onClick={() => setName('Marcadores de Gol - Opção 1 Último')}
              className={
                name === 'Marcadores de Gol - Opção 1 Último'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Último
            </button>

            <button
              onClick={() =>
                setName('Marcadores de Gol - Opção 1 A Qualquer Momento')
              }
              className={
                name === 'Marcadores de Gol - Opção 1 A Qualquer Momento'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              A Qualquer Momento
            </button>

            <div>Opção 2</div>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 2 Primeiro')}
              className={
                name === 'Marcadores de Gol - Opção 2 Primeiro'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Primeiro
            </button>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 2 Último')}
              className={
                name === 'Marcadores de Gol - Opção 2 Último'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Último
            </button>

            <button
              onClick={() =>
                setName('Marcadores de Gol - Opção 2 A Qualquer Momento')
              }
              className={
                name === 'Marcadores de Gol - Opção 2 A Qualquer Momento'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              A Qualquer Momento
            </button>

            <div>Opção 3</div>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 3 Primeiro')}
              className={
                name === 'Marcadores de Gol - Opção 3 Primeiro'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Primeiro
            </button>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 3 Último')}
              className={
                name === 'Marcadores de Gol - Opção 3 Último'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Último
            </button>

            <button
              onClick={() =>
                setName('Marcadores de Gol - Opção 3 A Qualquer Momento')
              }
              className={
                name === 'Marcadores de Gol - Opção 3 A Qualquer Momento'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              A Qualquer Momento
            </button>

            <div>Opção 4</div>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 4 Primeiro')}
              className={
                name === 'Marcadores de Gol - Opção 4 Primeiro'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Primeiro
            </button>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 4 Último')}
              className={
                name === 'Marcadores de Gol - Opção 4 Último'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Último
            </button>

            <button
              onClick={() =>
                setName('Marcadores de Gol - Opção 4 A Qualquer Momento')
              }
              className={
                name === 'Marcadores de Gol - Opção 4 A Qualquer Momento'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              A Qualquer Momento
            </button>

            <div>Opção 5</div>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 5 Primeiro')}
              className={
                name === 'Marcadores de Gol - Opção 5 Primeiro'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Primeiro
            </button>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 5 Último')}
              className={
                name === 'Marcadores de Gol - Opção 5 Último'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Último
            </button>

            <button
              onClick={() =>
                setName('Marcadores de Gol - Opção 5 A Qualquer Momento')
              }
              className={
                name === 'Marcadores de Gol - Opção 5 A Qualquer Momento'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              A Qualquer Momento
            </button>

            <div>Opção 6</div>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 6 Primeiro')}
              className={
                name === 'Marcadores de Gol - Opção 6 Primeiro'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Primeiro
            </button>

            <button
              onClick={() => setName('Marcadores de Gol - Opção 6 Último')}
              className={
                name === 'Marcadores de Gol - Opção 6 Último'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Último
            </button>

            <button
              onClick={() =>
                setName('Marcadores de Gol - Opção 6 A Qualquer Momento')
              }
              className={
                name === 'Marcadores de Gol - Opção 6 A Qualquer Momento'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              A Qualquer Momento
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Handicap Asiático</h2>

            <button
              onClick={() => setName('Handicap Asiático - Mandante')}
              className={
                name === 'Handicap Asiático - Mandante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante
            </button>
            <button
              onClick={() => setName('Handicap Asiático - Visitante')}
              className={
                name === 'Handicap Asiático - Visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Visitante
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Gols +/-</h2>

            <div>Opção única</div>

            <button
              onClick={() => setName('Gols +/- - Mais de')}
              className={
                name === 'Gols +/- - Mais de'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mais de
            </button>
            <button
              onClick={() => setName('Gols +/- - Menos de')}
              className={
                name === 'Gols +/- - Menos de'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Menos de
            </button>
          </div>

          <div className={styles.bet4}>
            <h2 className={styles.betTitle}>Escanteios</h2>

            <div>Opção única</div>

            <button
              onClick={() => setName('Escanteios - Mais de')}
              className={
                name === 'Escanteios - Mais de'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mais de
            </button>

            <button
              onClick={() => setName('Escanteios - Exatamente')}
              className={
                name === 'Escanteios - Exatamente'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Exatamente
            </button>

            <button
              onClick={() => setName('Escanteios - Menos de')}
              className={
                name === 'Escanteios - Menos de'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Menos de
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Empate Anula Aposta</h2>

            <button
              onClick={() => setName('Empate Anula Aposta - Mandante')}
              className={
                name === 'Empate Anula Aposta - Mandante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante
            </button>

            <button
              onClick={() => setName('Empate Anula Aposta - Visitante')}
              className={
                name === 'Empate Anula Aposta - Visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Visitante
            </button>
          </div>

          <div className={styles.bet}>
            <h2 className={styles.betTitle}>Handicap - Resultado</h2>

            <button
              onClick={() => setName('Handicap - Resultado - Mandante')}
              className={
                name === 'Handicap - Resultado - Mandante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Mandante
            </button>

            <button
              onClick={() => setName('Handicap - Resultado - Empate')}
              className={
                name === 'Handicap - Resultado - Empate'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Empate
            </button>

            <button
              onClick={() => setName('Handicap - Resultado - Visitante')}
              className={
                name === 'Handicap - Resultado - Visitante'
                  ? styles.buttonActive
                  : styles.betButton
              }
              type="button"
            >
              Visitante
            </button>
          </div>

          <button type="submit">Replicar</button>
        </form>
      </main>
    </div>
  );
}
