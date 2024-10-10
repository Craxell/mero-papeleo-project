import React from "react";
import "../assets/css/Profile.css";
import { useAuth } from "../auth/AuthContext";

const Profile: React.FC = () => {
  const { username } = useAuth();

  return (
    <>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 p-2">
              <div className="profile-custom">
                <h1 className="profile-title-custom">Profile</h1>
                <hr className="my-4 split-profile" />
                <div className="profile-info">
                  <div className="profile-info-item">
                    <h5>Nombre de Usuario: {username}</h5>
                    <p></p>
                  </div>
                  <div className="profile-info-item">
                    <h5>Correo: </h5>
                    </div>
                  </div>
                <hr className="my-4 split-profile" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;