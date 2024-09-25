import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { baseUrl } from '../../helpers/url';
import axios from 'axios';

import '../../assets/css/Users.css';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
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
    setEditedUser(user);  // Llenar los campos del modal con el usuario seleccionado
    setShowModal(true);
  };

  const handleDeleteClick = async (userId: string) => {
    try {
      await axios.delete(`${baseUrl}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (editedUser) {
      try {
        await axios.put(`${baseUrl}/users/${editedUser.id}`, editedUser);
        setUsers(users.map((user) => (user.id === editedUser.id ? editedUser : user)));
        setShowModal(false);
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
      }
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
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td className='text-center'>{user.role}</td>
                        <td className='text-center'>
                          <Button variant="primary" onClick={() => handleEditClick(user)}>
                            Editar
                          </Button>
                          <Button variant="danger" onClick={() => handleDeleteClick(user.id)} className="ms-2">
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
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
