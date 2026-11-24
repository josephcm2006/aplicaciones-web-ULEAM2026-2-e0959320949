import { component$, useStyles$ } from "@builder.io/qwik";
import estilos from "./registro.css?inline";
import { usePacientes } from "./logica";

export const Registro = component$(() => {
  useStyles$(estilos);
  const { estado, tiposSangre, limpiar, registrar, editar, eliminar } =
    usePacientes();

  return (
    <div class="contenedor-registro">
      <h2>Registro de Pacientes</h2>

      <form
        class="formulario-paciente"
        preventdefault:submit
        onSubmit$={registrar}
      >
        <div class="campo">
          <label for="nombre">Nombre completo</label>
          <input
            id="nombre"
            type="text"
            value={estado.nombre}
            onInput$={(e, target) => {
              estado.nombre = target.value;
            }}
          />
        </div>

        <div class="campo">
          <label for="cedula">Cédula (10 dígitos)</label>
          <input
            id="cedula"
            type="text"
            maxLength={10}
            inputMode="numeric"
            value={estado.cedula}
            onInput$={(e, target) => {
              const soloNumeros = target.value.replace(/\D/g, "").slice(0, 10);
              estado.cedula = soloNumeros;
            }}
          />
        </div>

        <div class="campo">
          <label for="telefono">Teléfono (10 dígitos)</label>
          <input
            id="telefono"
            type="text"
            maxLength={10}
            inputMode="numeric"
            value={estado.telefono}
            onInput$={(e, target) => {
              const soloNumeros = target.value.replace(/\D/g, "").slice(0, 10);
              estado.telefono = soloNumeros;
            }}
          />
        </div>

        <div class="campo">
          <label for="sangre">Tipo de sangre</label>
          <select
            id="sangre"
            value={estado.sangre}
            onChange$={(e, target) => {
              estado.sangre = target.value;
            }}
          >
            <option value="">Seleccione un tipo de sangre</option>
            {tiposSangre.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {estado.error && <div class="mensaje-error">{estado.error}</div>}

        <div class="acciones-form">
          <button type="submit" class="btn-primario">
            {estado.editando >= 0 ? "Actualizar" : "Registrar"}
          </button>

          {estado.editando >= 0 && (
            <button type="button" class="btn-secundario" onClick$={limpiar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div class="lista-pacientes">
        {estado.pacientes.map((paciente, i) => (
          <div key={`${paciente.cedula}-${i}`} class="fila-paciente">
            <div>
              <strong>{paciente.nombre}</strong> — Cédula: {paciente.cedula} |
              Tel: {paciente.telefono} | Sangre: {paciente.sangre}
            </div>
            <div class="acciones-fila">
              <button
                type="button"
                class="btn-secundario"
                onClick$={() => editar(i)}
              >
                Editar
              </button>
              <button
                type="button"
                class="btn-peligro"
                onClick$={() => eliminar(i)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
