import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, CircularProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API = 'https://web-a8backend-production.up.railway.app';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [addError, setAddError] = useState('');

  
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/users`, { headers: authHeaders() });
      if (res.status === 401) {
        setError('Sesión expirada. Por favor vuelve a iniciar sesión.');
        return;
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!newName || !newUsername || !newPassword) {
      setAddError('Todos los campos son obligatorios');
      return;
    }
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: newName, username: newUsername, password: newPassword })
      });
      if (res.status === 401) { setAddError('No autorizado'); return; }
      setNewName(''); setNewUsername(''); setNewPassword('');
      fetchUsers();
    } catch (err) {
      setAddError('Error al agregar usuario');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    try {
      await fetch(`${API}/users/${id}`, { method: 'DELETE', headers: authHeaders() });
      fetchUsers();
    } catch (err) {
      setError('Error al eliminar usuario');
    }
  };

  const handleEditOpen = (user) => {
    setEditUser(user);
    setEditName(user.name);
    setEditUsername(user.username);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await fetch(`${API}/users/${editUser._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ name: editName, username: editUsername })
      });
      setEditOpen(false);
      fetchUsers();
    } catch (err) {
      setError('Error al actualizar usuario');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Administración de Usuarios</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {}
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>Agregar Usuario</Typography>
        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <TextField label="Nombre" size="small" value={newName} onChange={e => setNewName(e.target.value)} />
          <TextField label="Usuario" size="small" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
          <TextField label="Contraseña" type="password" size="small" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <Button type="submit" variant="contained">Agregar</Button>
        </form>
        {addError && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{addError}</Typography>}
      </Paper>

      {}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Creado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">No hay usuarios registrados</TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEditOpen(user)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(user._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, minWidth: 300 }}>
          <TextField label="Nombre" value={editName} onChange={e => setEditName(e.target.value)} fullWidth />
          <TextField label="Usuario" value={editUsername} onChange={e => setEditUsername(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
          <Button onClick={handleEditSave} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
