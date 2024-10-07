import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { User } from '../pages/users';
import "../assets/css/UsersModals.css";

interface ViewUsersModalProps {
  show: boolean;
  onHide: () => void;
  user: User | null;
}

const ViewUsersModal: React.FC<ViewUsersModalProps> = ({ show, onHide, user }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <div>
            <p><strong>Nombre de Usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
          </div>
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className='btnCerrarEditUserModal' onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewUsersModal;
