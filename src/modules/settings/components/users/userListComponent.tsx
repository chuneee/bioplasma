import { Edit2, Plus, Shield, Trash2 } from "lucide-react";
import { User } from "../../types/user.type";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../components/ui/alert-dialog";

interface UserListComponentProps {
  usuarios?: User[] | [];
  onDelete?: (userId: number) => void;
  onEdit?: (userId: number) => void;
}

export const UserListComponent = ({
  usuarios,
  onDelete,
  onEdit,
}: UserListComponentProps) => {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    if (usuarios) setUserList(usuarios);
  }, [usuarios]);

  const handleDelete = (userId: number) => {
    onDelete?.(userId);
  };

  const handleEdit = (userId: number) => {
    onEdit?.(userId);
  };

  const UsuarioMapItem = ({ usuario }: { usuario: User }) => {
    const { id, username, email, role, isActive } = usuario;

    return (
      <div
        key={usuario.id}
        className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white">
            <span style={{ fontSize: "16px", fontWeight: 600 }}>
              {username
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>
          <div>
            <h4 style={{ fontWeight: 500, fontSize: "14px" }}>{username}</h4>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "13px" }}
            >
              {email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <span
              className={`px-3 py-1 rounded-full text-white ${
                role.name === "administrador"
                  ? "bg-[var(--color-primary)]"
                  : "bg-blue-500"
              }`}
              style={{ fontSize: "12px", fontWeight: 500 }}
            >
              {role.name}
            </span>
            <p
              className="text-[var(--color-text-secondary)] mt-1"
              style={{ fontSize: "11px", color: isActive ? "green" : "red" }}
            >
              {isActive ? "Activo" : "Inactivo"}
            </p>
          </div>
          <button
            onClick={() => handleEdit(id)}
            className="p-2 hover:bg-[var(--color-bg)] rounded-lg transition-all"
          >
            <Edit2 size={16} className="text-[var(--color-text-secondary)]" />
          </button>
          {role.name !== "administrador" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  // onClick={() => handleDelete(id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Desabilitar usuario?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción deshabilitará al usuario {username} y no podrá
                    acceder al sistema. ¿Deseas continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(id)}>
                    Aceptar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-3">
      {userList?.map((usuario) => (
        <UsuarioMapItem key={usuario.id} usuario={usuario} />
      ))}
    </div>
  );
};
