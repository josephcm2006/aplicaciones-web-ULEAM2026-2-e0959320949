import { $, useStore, useVisibleTask$ } from "@builder.io/qwik";

export interface Paciente {
  nombre: string;
  cedula: string;
  telefono: string;
  sangre: string;
}

const TIPOS_SANGRE = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const STORAGE_KEY = "pacientes_qwik_v1";

export const usePacientes = () => {
  const estado = useStore({
    nombre: "",
    cedula: "",
    telefono: "",
    sangre: "",
    error: "",
    editando: -1,
    pacientes: [] as Paciente[],
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado);
        if (Array.isArray(parsed)) {
          estado.pacientes = parsed;
        }
      } catch {
        estado.error = "No se pudieron cargar los pacientes guardados.";
      }
    }
  });

  const guardarStorage = $((lista: Paciente[]) => {
    const dataLimpia: Paciente[] = [];
    for (let i = 0; i < lista.length; i++) {
      const p = lista[i];
      if (p) {
        dataLimpia.push({
          nombre: String(p.nombre || ""),
          cedula: String(p.cedula || ""),
          telefono: String(p.telefono || ""),
          sangre: String(p.sangre || ""),
        });
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataLimpia));
  });

  const limpiar = $(() => {
    estado.nombre = "";
    estado.cedula = "";
    estado.telefono = "";
    estado.sangre = "";
    estado.error = "";
    estado.editando = -1;
  });

  const registrar = $(async () => {
    const nombre = estado.nombre.trim();
    const cedula = estado.cedula.trim();
    const telefono = estado.telefono.trim();
    const sangre = estado.sangre.trim();

    if (!nombre || !cedula || !telefono || !sangre) {
      estado.error = "Todos los campos son obligatorios.";
      return;
    }

    if (!/^\d{10}$/.test(cedula)) {
      estado.error = "La cédula debe tener exactamente 10 números.";
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      estado.error = "El teléfono debe tener exactamente 10 números.";
      return;
    }

    const paciente: Paciente = { nombre, cedula, telefono, sangre };

    if (estado.editando >= 0) {
      estado.pacientes[estado.editando] = paciente;
    } else {
      estado.pacientes.push(paciente);
    }

    // Convertir a objetos planos antes de serializar
    const copiaPlana: Paciente[] = estado.pacientes.map((p) => ({
      nombre: p.nombre,
      cedula: p.cedula,
      telefono: p.telefono,
      sangre: p.sangre,
    }));

    await guardarStorage(copiaPlana);
    await limpiar();
  });

  const editar = $((i: number) => {
    const p = estado.pacientes[i];
    if (!p) return;
    estado.nombre = p.nombre;
    estado.cedula = p.cedula;
    estado.telefono = p.telefono;
    estado.sangre = p.sangre;
    estado.error = "";
    estado.editando = i;
  });

  const eliminar = $(async (i: number) => {
    estado.pacientes.splice(i, 1);
    if (estado.editando === i) {
      await limpiar();
    } else if (estado.editando > i) {
      estado.editando -= 1;
    }
    const copiaPlana: Paciente[] = estado.pacientes.map((p) => ({
      nombre: p.nombre,
      cedula: p.cedula,
      telefono: p.telefono,
      sangre: p.sangre,
    }));
    await guardarStorage(copiaPlana);
  });

  return {
    estado,
    tiposSangre: TIPOS_SANGRE,
    limpiar,
    registrar,
    editar,
    eliminar,
  };
};
