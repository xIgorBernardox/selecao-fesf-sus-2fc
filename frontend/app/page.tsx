"use client";

import { useEffect, useState } from "react";

interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
}

const API = "http://localhost:8000";

export default function Home() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    data_nascimento: "",
    telefone: "",
  });
  const [editando, setEditando] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(false);

  async function buscarPacientes() {
    const res = await fetch(`${API}/pacientes`);
    const data = await res.json();
    setPacientes(data);
  }

  useEffect(() => {
    buscarPacientes();
  }, []);

  function validarCPF(cpf: string) {
    const nums = cpf.replace(/\D/g, "");
    if (nums.length !== 11 || /^(\d)\1+$/.test(nums)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
    let r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(nums[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
    r = (soma * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    return r === parseInt(nums[10]);
  }

  function validarData(data: string) {
    if (data.length !== 10) return false;
    const [dia, mes, ano] = data.split("/").map(Number);
    if (mes < 1 || mes > 12) return false;
    if (dia < 1 || dia > 31) return false;
    const date = new Date(ano, mes - 1, dia);
    if (
      date.getFullYear() !== ano ||
      date.getMonth() !== mes - 1 ||
      date.getDate() !== dia
    )
      return false;
    if (date > new Date()) return false;
    return true;
  }

  function validarForm() {
    const erros: string[] = [];

    const palavras = form.nome.trim().split(/\s+/);
    if (!form.nome.trim()) {
      erros.push("Nome é obrigatório.");
    } else if (palavras.length < 2 || palavras.some((p) => p.length < 2)) {
      erros.push("Informe o nome completo (nome e sobrenome).");
    }

    if (!form.cpf) {
      erros.push("CPF é obrigatório.");
    } else if (!validarCPF(form.cpf)) {
      erros.push("CPF inválido.");
    } else {
      const cpfJaCadastrado = pacientes.some(
        (p) => p.cpf === form.cpf && p.id !== editando?.id,
      );
      if (cpfJaCadastrado) erros.push("Este CPF já está cadastrado.");
    }

    if (!form.data_nascimento) {
      erros.push("Data de nascimento é obrigatória.");
    } else if (!validarData(form.data_nascimento)) {
      erros.push("Data inválida. Use o formato DD/MM/AAAA e uma data real.");
    }

    const tel = form.telefone.replace(/\D/g, "");
    if (!form.telefone) {
      erros.push("Telefone é obrigatório.");
    } else if (tel.length < 10) {
      erros.push("Telefone inválido.");
    }

    if (erros.length > 0) {
      alert(erros.join("\n"));
      return false;
    }

    return true;
  }

  async function salvar() {
    if (!validarForm()) return;

    if (editando) {
      const campos: string[] = [];
      if (form.nome !== editando.nome) campos.push("nome");
      if (form.cpf !== editando.cpf) campos.push("CPF");
      if (form.data_nascimento !== editando.data_nascimento)
        campos.push("data de nascimento");
      if (form.telefone !== editando.telefone) campos.push("telefone");

      const mensagem =
        campos.length === 0
          ? "Nenhuma alteração detectada."
          : `Deseja mesmo alterar ${campos.join(", ")} do paciente?`;

      if (campos.length === 0) {
        alert(mensagem);
        return;
      }

      abrirModal(mensagem, async () => {
        setLoading(true);
        await fetch(`${API}/pacientes/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setEditando(null);
        setForm({ nome: "", cpf: "", data_nascimento: "", telefone: "" });
        await buscarPacientes();
        setLoading(false);
        fecharModal();
      });
      return;
    }

    setLoading(true);
    await fetch(`${API}/pacientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ nome: "", cpf: "", data_nascimento: "", telefone: "" });
    await buscarPacientes();
    setLoading(false);
  }

  function deletar(p: Paciente) {
    abrirModal(`Deseja mesmo excluir o paciente ${p.nome}?`, async () => {
      await fetch(`${API}/pacientes/${p.id}`, { method: "DELETE" });
      buscarPacientes();
      fecharModal();
    });
  }

  function iniciarEdicao(p: Paciente) {
    setEditando(p);
    setForm({
      nome: p.nome,
      cpf: p.cpf,
      data_nascimento: p.data_nascimento,
      telefone: p.telefone,
    });
  }

  const [modalConfig, setModalConfig] = useState<{
    visivel: boolean;
    mensagem: string;
    onConfirmar: () => void;
  }>({ visivel: false, mensagem: "", onConfirmar: () => {} });

  function abrirModal(mensagem: string, onConfirmar: () => void) {
    setModalConfig({ visivel: true, mensagem, onConfirmar });
  }

  function fecharModal() {
    setModalConfig({ visivel: false, mensagem: "", onConfirmar: () => {} });
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Sistema de Pacientes
        </h1>
        <p className="text-gray-500 mb-8">FESF-SUS — Cadastro e Gestão</p>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-lg text-black font-semibold mb-4">
            {editando ? "Editar Paciente" : "Novo Paciente"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-400 placeholder:text-gray-400 text-gray-900"
              placeholder="Nome completo"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900"
              placeholder="CPF (000.000.000-00)"
              value={form.cpf}
              maxLength={14}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length >= 4) v = v.slice(0, 3) + "." + v.slice(3);
                if (v.length >= 8) v = v.slice(0, 7) + "." + v.slice(7);
                if (v.length >= 12) v = v.slice(0, 11) + "-" + v.slice(11);
                setForm({ ...form, cpf: v });
              }}
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900"
              placeholder="dd/mm/aaaa"
              value={form.data_nascimento}
              maxLength={10}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                if (v.length >= 6) v = v.slice(0, 5) + "/" + v.slice(5);
                setForm({ ...form, data_nascimento: v });
              }}
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-gray-900"
              placeholder="Telefone +00 (00) 00000-0000"
              value={form.telefone}
              maxLength={19}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length > 13) v = v.slice(0, 13);
                let mask = "";
                if (v.length > 0) mask = "+" + v.slice(0, 2);
                if (v.length > 2) mask += " (" + v.slice(2, 4);
                if (v.length > 4) mask += ") " + v.slice(4, 9);
                if (v.length > 9) mask += "-" + v.slice(9, 13);
                setForm({ ...form, telefone: mask });
              }}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={salvar}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading
                ? "Salvando..."
                : editando
                  ? "Salvar Edição"
                  : "Cadastrar"}
            </button>
            {editando && (
              <button
                onClick={() => {
                  setEditando(null);
                  setForm({
                    nome: "",
                    cpf: "",
                    data_nascimento: "",
                    telefone: "",
                  });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg text-black font-semibold mb-4">
            Pacientes Cadastrados ({pacientes.length})
          </h2>
          {pacientes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Nenhum paciente cadastrado ainda.
            </p>
          ) : (
            <ul className="divide-y">
              {pacientes.map((p) => (
                <li
                  key={p.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{p.nome}</p>
                    <p className="text-sm text-gray-500">
                      CPF: {p.cpf} · Tel: {p.telefone} · Nasc:{" "}
                      {p.data_nascimento}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => iniciarEdicao(p)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deletar(p)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {modalConfig.visivel && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <p className="text-gray-800 font-medium text-center mb-6">
              {modalConfig.mensagem}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={modalConfig.onConfirmar}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Sim
              </button>
              <button
                onClick={fecharModal}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
