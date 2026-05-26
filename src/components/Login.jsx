import { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setError("Por favor, ingresa usuario y contraseña");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://web-a8backend-production.up.railway.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.login) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(data.msg || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error al conectar con el servidor. ¿Está corriendo el backend?");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', bgcolor: 'background.default', p: 2
    }}>
      <Card sx={{ 
          width: '100%', maxWidth: '400px', bgcolor: 'background.paper', 
          borderRadius: 4, boxShadow: '0 8px 16px rgba(0,0,0,0.5)', p: 3
      }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: '500', mb: 4 }}>
            Iniciar Sesión
          </Typography>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <TextField 
              label="Nombre de usuario" variant="outlined" fullWidth
              value={username} onChange={(e) => setUsername(e.target.value)} 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }} 
            />
            <TextField 
              label="Contraseña" type={showPassword ? 'text' : 'password'} variant="outlined" fullWidth
              value={password} onChange={(e) => setPassword(e.target.value)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }} 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Typography color="error" variant="body2" textAlign="center">
                {error}
              </Typography>
            )}
            <Button
              type="submit" variant="contained" color="primary" size="large" fullWidth
              disabled={loading}
              sx={{ borderRadius: 28, textTransform: 'none', fontSize: '1.1rem', py: 1.5, mt: 2 }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}