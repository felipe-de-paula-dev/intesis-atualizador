"use client";

import Swal from 'sweetalert2';
import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Save, 
  LogOut, 
  FileIcon, 
  Calendar as CalendarIcon,
  Users,
  Package,
  File,
  User
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { id } from "date-fns/locale/id";
import { limitarTexto } from "@/app/service/utils";
import { DataList } from '../utils/DataList';
import axios from 'axios';

export interface Arquivo {
    id: number;
    nome: string;
    tamanho: string;
}

export interface Empresa {
  id: number;
  razaoSocial: string;      
  nomeFantasia: string;     
  cnpj: string;
  dataCad: string;          
  codSeguranca: string;     
  serial: string;
  dataImportacao: string | null; 
  ativo: boolean;
  cidade: string;
  uf: string;
  tipo: string | null;      
  telefone: string;
  telefone2?: string | null;
  celular: string;
  contatos: string;
  observacoes: string;
  email: string;
  parceiro: string;
  idParceiro: number | null;
  verificarBackup: boolean;  
}

export type VisaoAtiva = "idle" | "arquivos" | "empresas";

export function CadastroAtualizacao() {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const [aplicacao, setAplicacao] = useState("1");
  const [selectedArquivos, setSelectedArquivos] = useState<number[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<number[]>([]);
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [visao, setVisao] = useState<VisaoAtiva>("idle");
  const [descricao, setDescricao] = useState("");

    async function fetchArquivos() {
        const response = await fetch(`http://192.168.0.19:8080/api/arquivo/listar`);
        const data = await response.json();
        setArquivos(data);
    }

    async function fetchEmpresas() {
        const response = await fetch(`http://192.168.0.19:8080/api/empresas`);
        const data = await response.json();
        setEmpresas(data);
    }

    useEffect(() => {
        fetchArquivos();
        fetchEmpresas();    
    },[])


  const handleToggleGeneric = (
  idOrIds: number | number[], 
  setSelected: React.Dispatch<React.SetStateAction<number[]>>
) => {
  setSelected(prev => {
    const idsToToggle = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    
    if (Array.isArray(idOrIds)) {
      const others = prev.filter(id => !idsToToggle.includes(id));
      const allSelected = Array.from(new Set([...prev, ...idsToToggle]));
      return allSelected;
    }

    return prev.includes(idsToToggle[0])
      ? prev.filter(i => i !== idsToToggle[0])
      : [...prev, idsToToggle[0]];
  });
};

  const handleSalvar = async () => {
    const payload = {
      id_aplicacao: parseInt(aplicacao),
      data: new Date().toISOString(),
      arquivos_ids: selectedArquivos,
      clientes_ids: selectedClientes,
    };

    Swal.fire({
      title: "Confirmação",
      text: "Deseja salvar esta atualização?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, salvar!",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {

      const payload = {
        descricao: descricao,
        data: new Date().toISOString(),
        hom: true,
        prd: true,
        id_aplicacao: parseInt(aplicacao),
        idArquivos: selectedArquivos,
        idEmpresas: selectedClientes,
      }

      try{
      const response = await axios.post("http://192.168.0.19:8080/api/atualizacao/salvar", payload);
      const data = response.data;
      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: data || 'Atualização salva com sucesso.',
          timer: 3000
        });
      }
      }catch(error: any){
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: error.response?.data || 'Ocorreu um erro ao salvar a atualização.',
          timer: 3000
        });
      }
  });
}

  return (
    <div className="p-6 space-y-3 w-full mx-auto">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Nova Atualização de Sistema</h1>
          <p className="text-slate-500 text-sm">Configure os pacotes e clientes para atualizar.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline" className="gap-2">
                <LogOut size={16} /> Sair
            </Button>
          </Link>
          <Button onClick={handleSalvar} className="bg-blue-600 hover:bg-blue-700 gap-2 px-8">
            <Save size={16} /> Salvar Registro
          </Button>
        </div>
      </div>

      <div className="relative w-full">
        <Input 
          placeholder="Descrição da atualização..." 
          className="h-8 text-xs" 
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4 bg-slate-50 p-4 rounded-xl border">
          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-slate-500">Aplicação</Label>
            <Select value={aplicacao} onValueChange={setAplicacao}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">ERP</SelectItem>
                <SelectItem value="2">PREVENDA</SelectItem>
                <SelectItem value="4">SAT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase font-bold text-slate-500">Data Atual</Label>
            <div className="h-10 px-3 flex items-center gap-2 bg-slate-200/50 border rounded-md text-slate-600 cursor-not-allowed">
              <CalendarIcon size={16} />
              <span className="text-sm font-medium">{dataAtual}</span>
            </div>
          </div>

          <div className="pt-4 space-y-2">
             <div className="text-xs font-bold text-blue-600 flex items-center gap-2">
                <Package size={14}/> {selectedArquivos.length} Arquivos Selecionados
             </div>
             <div className="text-xs font-bold text-indigo-600 flex items-center gap-2">
                <Users size={14}/> {selectedClientes.length} Clientes Selecionados
             </div>
          </div>
        </div>

        <div className='flex flex-col w-max items-center gap-4'>
          {visao === "idle" && (
          <p className="text-muted-foreground">Clique em um dos botões abaixo para começar.</p>
        )}

        {visao === "arquivos" && (
          <DataList
            title="Listagem de Arquivos"
            entities={arquivos.map(a => ({
              id: a.id,
              label: a.nome,
              sublabel: a.tamanho
            }))}
            selectedIds={selectedArquivos}
            onToggle={(id) => handleToggleGeneric(id, setSelectedArquivos)}
            onClose={() => setVisao("idle")}
          />
        )}

        {visao === "empresas" && (
          <DataList
            title="Listagem de Empresas"
            entities={empresas.map(e => ({
              id: e.id,
              label: e.nomeFantasia,
              sublabel: e.razaoSocial
            }))}
            selectedIds={selectedClientes}
            onToggle={(id) => handleToggleGeneric(id, setSelectedClientes)}
            onClose={() => setVisao("idle")}
          />
        )}

          <div className='flex gap-4 w-max'>
            <button 
            onClick={() => setVisao("arquivos")}
            className={`
              flex flex-col items-center justify-center gap-3 p-6 w-full h-36
              rounded-xl border-2 transition-all duration-200
              ${visao === 'arquivos' 
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-200' 
                : 'border-slate-200 bg-white text-slate-600 hover:border-blue-400 hover:bg-slate-50 hover:shadow-sm'}
            `}
          >
            <div className={`p-3 rounded-full ${visao === 'arquivos' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <File size={32} strokeWidth={1.5} />
            </div>
            <span className="font-semibold text-sm">Anexar Arquivos</span>
          </button>

          <button 
              onClick={() => setVisao("empresas")}
              className={`
                flex flex-col items-center justify-center gap-3 p-6 w-full h-36
                rounded-xl border-2 transition-all duration-200
                ${visao === 'empresas' 
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-md ring-2 ring-emerald-200' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:bg-slate-50 hover:shadow-sm'}
              `}
            >
              <div className={`p-3 rounded-full ${visao === 'empresas' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <User size={32} strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-sm">Anexar Empresas</span>
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}