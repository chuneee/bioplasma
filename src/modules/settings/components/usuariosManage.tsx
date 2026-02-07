import { Plus, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { User, UserCredentials } from "../types/user.type";
import { UserListComponent } from "./users/userListComponent";
import { UserService } from "../services/user.service";
import { UsuarioFormModal } from "./users/usuariosForm";
import { message } from "../../../components/shared/message/message";

export const UsuariosManageSection = () => {
  const [isUsuarioFormOpen, setIsUsuarioFormOpen] = useState(false);

  const [usuariosData, setUsuariosData] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsuarios = async () => {
    try {
      const response = await UserService.getUsers();
      const data = response;
      setUsuariosData(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUsuarioSubmit = async (data: UserCredentials) => {
    try {
      if (editingUser) {
        if (data.password === "") {
          delete data.password;
        }
        const updatedUser = await UserService.updateUser(editingUser.id, data);
        setUsuariosData((prev) =>
          prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
        );
        setEditingUser(null);
      } else {
        const newUser = await UserService.createUser(data);
        setUsuariosData((prev) => [...prev, newUser]);
      }

      return message.success("Guardado con éxito");
    } catch (error) {
      console.error("Error creating user:", error);

      message.error("Error al guardar el usuario");
    }
  };

  const hanldeUserDelete = async (userId: number) => {
    try {
      await UserService.deleteUser(userId);
      setUsuariosData((prev) => prev.filter((u) => u.id !== userId));
      message.success("Usuario eliminado con éxito");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Error al eliminar el usuario");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handelOpenNewUsuarioForm = () => {
    setIsUsuarioFormOpen(true);
  };

  const onFormEdit = (userId: number) => {
    const userToEdit = usuariosData.find((u) => u.id === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setIsUsuarioFormOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1" style={{ fontWeight: 600, fontSize: "16px" }}>
              Usuarios del Sistema
            </h3>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              Gestiona los usuarios que tienen acceso al sistema
            </p>
          </div>
          <button
            onClick={handelOpenNewUsuarioForm}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              Nuevo Usuario
            </span>
          </button>
        </div>
        <UserListComponent
          usuarios={usuariosData}
          onDelete={hanldeUserDelete}
          onEdit={onFormEdit}
        />
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-3">
            <Shield size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-amber-900"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Permisos por rol
              </p>
              <ul
                className="text-amber-700 mt-2 space-y-1"
                style={{ fontSize: "13px" }}
              >
                <li>
                  • <strong>Administrador:</strong> Acceso completo a todos los
                  módulos
                </li>
                <li>
                  • <strong>Recepcionista:</strong> Pacientes, Agenda,
                  Cotizaciones, Ventas (sin eliminar)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <UsuarioFormModal
        open={isUsuarioFormOpen}
        onClose={() => {
          setEditingUser(null);
          setIsUsuarioFormOpen(false);
        }}
        onSubmit={handleUsuarioSubmit}
        currentUser={editingUser}
      />
    </div>
  );
};
