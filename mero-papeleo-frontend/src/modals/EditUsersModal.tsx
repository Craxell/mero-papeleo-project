import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { User, Role } from '../pages/users';
import "../assets/css/UsersModals.css";

type FormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

interface UsersModalProps {
  show: boolean;
  onHide: () => void;
  editedUser: User | null;
  onChange: (e: React.ChangeEvent<FormControlElement>) => void;
  onSave: () => void;
  onCancel: () => void;
  roles: Role[];
}

const UsersModal: React.FC<UsersModalProps> = ({
  show,
  onHide,
  editedUser,
  onChange,
  onSave,
  onCancel,
  roles,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {/* Revisar esto */}
        <Modal.Title>{editedUser ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>  
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={editedUser?.username}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedUser?.email}
              onChange={onChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="role">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              name="role"
              value={editedUser?.role}
              onChange={onChange}
            >
              <option value="" disabled hidden>
                Selecciona un rol
              </option>
              {roles.map((role) => (
                <option key={role._id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Contraseña (opcional)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Dejar en blanco para no cambiar"
              onChange={onChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsersModal;
