import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { baseUrl } from '../../helpers/url';
import axios from 'axios';
import Swal from 'sweetalert2';

import '../../assets/css/Users.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  hashed_password: string;
}

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users`);
        const data: User[] = response.data;
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (user: User) => {
    console.log("Usuario seleccionado para editar:", user.username);
    setEditedUser(user);
    setShowModal(true);
  };

  const handleDeleteClick = async (username: string) => {
    try {
      await axios.delete(`${baseUrl}/users/${username}`);
      setUsers(users.filter((user) => user.username !== username));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (editedUser) {
      console.log("Datos del usuario a actualizar:", editedUser);
  
      // Confirmación para guardar cambios
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Los cambios se guardarán.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
      });
  
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${baseUrl}/users/${editedUser.username}`, editedUser);
          console.log("Respuesta de la actualización:", response.data);
          setUsers(users.map((user) => (user.username === editedUser.username ? editedUser : user)));
          setShowModal(false);
          Swal.fire('¡Éxito!', response.data.message, 'success');
        } catch (error) {
          console.error('Error al actualizar usuario:', error);
          Swal.fire('Error', "Error capt. en frontend", 'error');
        }
      }
    } else {
      console.error('No hay usuario editado para actualizar.');
    }
  };
  

  const handleCancelChanges = async () => {
    const result = await Swal.fire({
      title: '¿Deseas descartar los cambios?',
      text: "No se guardarán los cambios realizados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, descartar cambios',
    });

    if (result.isConfirmed) {
      setShowModal(false);
      setEditedUser(null); // Restablecer el usuario editado
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editedUser) {
      setEditedUser({ ...editedUser, [name]: value });
    }
  };

  return (
    <div className="content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 p-2">
            <div className="jumbotron rounded-0">
              <h1 className="display-4">Usuarios</h1>
              <p className="lead">Página de usuarios.</p>
              <hr className="my-4" />

              <Table striped bordered hover responsive className="mx-auto" style={{ maxWidth: '80%' }}>
                <thead>
                  <tr>
                    <th className='text-center'>Nombre</th>
                    <th className='text-center'>Email</th>
                    <th className='text-center'>Rol</th>
                    <th className='text-center'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td className='text-center'>{user.role}</td>
                        <td className='text-center'>
                          <Button variant="primary" onClick={() => handleEditClick(user)}>
                            Editar
                          </Button>
                          <Button variant="danger" onClick={() => handleDeleteClick(user.username)} className="ms-2">
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No hay usuarios disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar el usuario */}
      <Modal show={showModal} onHide={handleCancelChanges}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedUser && (
            <Form>
              <Form.Group controlId="formUsername">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={editedUser.username}
                  onChange={handleChange}
                  readOnly // Haciendo que el campo sea solo lectura
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formRole">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  value={editedUser.role}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Cambiar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Introduce nueva contraseña (opcional)"
                  value={editedUser.hashed_password}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelChanges}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Usuarios;
