import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { BaseUrl } from '../auth/BaseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';
import '@sweetalert2/themes/wordpress-admin/wordpress-admin.min.css';
import UsersModal from '../modals/EditUsersModal';
import ViewUserModal from '../modals/ViewUsersModal';
import '../assets/css/Users.css';

export interface User {
  id: number; // Asegúrate de que este id sea un número
  username: string;
  email: string;
  role: string;
  password?: string;
}

export interface Role {
  _id: string;
  name: string;
}

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/users`);
        const data: User[] = response.data;
        console.log("Usuarios obtenidos:", data);
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/roles`);
        setRoles(response.data);
        console.log('Roles obtenidos:', response.data);
      } catch (error) {
        console.error('Error al obtener roles:', error);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const handleEditClick = (user: User) => {
    if (user.id) {
      console.log('Usuario seleccionado para editar:', user);
      setEditedUser(user);
      setShowModal(true);
    } else {
      console.error('Error: El usuario seleccionado no tiene un id válido');
    }
  };

  const handleViewClick = (user: User) => {
    setViewedUser(user);
    setShowViewModal(true); // Muestra el modal de visualización
  };

  const handleDeleteClick = async (userId: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${BaseUrl}/users/${userId}`);
        console.log('Usuario eliminado:', response.data);
  
        // Actualizar el estado local para eliminar el usuario
        setUsers(users.filter(user => user.id !== userId));
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  const handleSaveChanges = async () => {
    if (editedUser) {
      console.log('Datos del usuario a actualizar:', editedUser);

      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Los cambios se guardarán.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
      });

      if (result.isConfirmed) {
        try {
          const userData: any = {
            id: editedUser.id.toString(),
            username: editedUser.username,
            email: editedUser.email,
            role: editedUser.role,

          };

          if (editedUser.password && editedUser.password.trim() !== '') {
            userData.password = editedUser.password;
          }

          // Usamos el id para la actualización
          const response = await axios.put(`${BaseUrl}/users/${editedUser.id}`, userData);
          console.log('Respuesta de la actualización:', response.data);

          // Actualizamos el estado local
          setUsers(users.map((user) => (user.id === editedUser.id ? { ...user, ...userData } : user)));
          setShowModal(false);
          Swal.fire('¡Éxito!', response.data.message, 'success');
        } catch (error) {
          console.error('Error al actualizar usuario:', error);
          if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Error desconocido';
            console.error('Mensaje de error:', errorMessage); // Agregar para depuración
            Swal.fire('Error', errorMessage, 'error');
          } else {
            Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
          }
        }
      }
    } else {
      console.error('No hay usuario editado para actualizar.');
    }
  };

  const handleCancelChanges = async () => {
    const result = await Swal.fire({
      title: '¿Deseas descartar los cambios?',
      text: 'No se guardarán los cambios realizados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, descartar cambios',
    });

    if (result.isConfirmed) {
      setShowModal(false);
      setEditedUser(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
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
                    <th className="text-center">Nombre</th>
                    <th className="text-center">Email</th>
                    <th className="text-center">Rol</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td className="text-center">{user.role}</td>
                        <td className="text-center">
                          <Button variant="primary" onClick={() => handleViewClick(user)} className="ms-2">
                            Ver
                          </Button>
                          <Button variant="success" onClick={() => handleEditClick(user)} className="ms-2">
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
      {/* Aquí se usa el Modal */}
      <UsersModal
        show={showModal}
        onHide={handleCancelChanges}
        editedUser={editedUser}
        onChange={handleChange}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
        roles={roles}
      />
      {/* Modal para ver detalles del usuario */}
      <ViewUserModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        user={viewedUser}
      />
    </div>
  );
};

export default Usuarios;
