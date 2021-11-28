import { useForm, SubmitHandler } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useAuth } from '../contexts/authContext';
import styles from '../styles/pages/index.module.scss';

import logoImg from '../../../assets/logo.png';

type Inputs = {
  email: string;
  password: string;
};

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const { signIn } = useAuth();
  const router = useHistory();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await signIn(data);
      router.replace('/home');
    } catch {
      alert('Erro ao entrar');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img width={179} height={188} src={logoImg} alt="Logo" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
        <input
          placeholder="E-mail"
          {...register('email', {
            pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail inválido' },
            required: { value: true, message: 'E-mail obrigatório!' },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}

        <input
          placeholder="Senha"
          type="password"
          {...register('password', { required: true })}
        />
        {errors.password && <span>A senha é obrigatória!</span>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
