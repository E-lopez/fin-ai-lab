import { useState } from "react";
import { useModalDispatch } from "@/stores/modals/ModalStore";
import { useTokenDispatch } from "@/stores/tokens/TokenStore";
import { AuthService } from "@/services/auth/authService";
import CustomButton from "../button/CustomButton";

const LoginModal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const tokenDispatch = useTokenDispatch();
  const modalDispatch = useModalDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const token = await AuthService.login({ username, password });
      (globalThis as any).authToken = token.access_token;
      tokenDispatch({
        type: 'SAVE_TOKEN',
        payload: {
          tokenData: token,
          userAuthenticated: true,
        },
      });
      modalDispatch({ type: 'HIDE_MODAL' });
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="u-center-v u-pt-30">
      <h1 className="paragraph paragraph--lg">Login</h1>
      <form onSubmit={handleLogin} className="form-loan-config u-center-v u-pt-30">
        <input
          className="form-loan-config__text-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="form-loan-config__text-input u-mb-30"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="paragraph paragraph--sm paragraph--error">{error}</p>}
        <CustomButton label="Login" type="submit" method={() => {}} cssModifier="primary" />
      </form>
    </div>
  );
};

export default LoginModal;
