"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Save, 
  LogOut, 
  FileIcon, 
  Calendar as CalendarIcon,
  Users,
  Package
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

export function CadastroAtualizacao() {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  
  const [aplicacao, setAplicacao] = useState("1");
  const [buscaArquivo, setBuscaArquivo] = useState("");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [selectedArquivos, setSelectedArquivos] = useState<number[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<number[]>([]);
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);


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

  function selecionarTodosArquivos() {

    if(selectedArquivos.length === arquivos.length) {
        setSelectedArquivos([]);
        return;
    }   

    if (arquivos.length > 0) {
    const todosIds = arquivos.map(f => f.id);
        
        setSelectedArquivos(prev => {
        const novoSet = new Set([...prev, ...todosIds]);
        return Array.from(novoSet);
        });
    }
  }

  function selecionarTodasEmpresas() {

    if(selectedClientes.length === empresas.length) {
        setSelectedClientes([]);
        return;
    }   

    if (empresas.length > 0) {
    const todosIds = empresas.map(f => f.id);
        setSelectedClientes(prev => {
        const novoSet = new Set([...prev, ...todosIds]);
        return Array.from(novoSet);
        });
    }
  }



  const arquivosFiltrados = useMemo(() => {
    return (arquivos || []).filter(f => 
        f.nome?.toLowerCase().includes(buscaArquivo.toLowerCase())
    );
}, [buscaArquivo, arquivos]);

const clientesFiltrados = useMemo(() => {
    return (empresas || []).filter(c => {
        const razao = c.razaoSocial?.toLowerCase() || "";
        const id = c.id?.toString() || "";
        const busca = buscaCliente.toLowerCase();

        return razao.includes(busca) || id.includes(busca);
    });
}, [buscaCliente, empresas]); 

  const toggleArquivo = (id: number) => {
    setSelectedArquivos(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const toggleCliente = (id: number) => {
    setSelectedClientes(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleSalvar = async () => {
    const payload = {
      id_aplicacao: parseInt(aplicacao),
      data: new Date().toISOString(),
      arquivos_ids: selectedArquivos,
      clientes_ids: selectedClientes,
    };
    
    console.log("Enviando para API:", payload);
    alert("Atualização salva com sucesso!");
  };

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

        <div className="md:col-span-3 space-y-3">
          
          <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2"><FileIcon size={16}/> Seleção de Arquivos</h3>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input 
                  placeholder="Filtrar arquivos..." 
                  className="h-8 pl-8 text-xs" 
                  value={buscaArquivo}
                  onChange={(e) => setBuscaArquivo(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[150px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center"><Checkbox onClick={() => selecionarTodosArquivos()}/></TableHead>
                    <TableHead>Nome do Arquivo</TableHead>
                    <TableHead>Tamanho</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {arquivosFiltrados.map(f => (
                    <TableRow key={f.id} className="cursor-pointer" onClick={() => toggleArquivo(f.id)}>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedArquivos.includes(f.id)} onCheckedChange={() => toggleArquivo(f.id)} />
                      </TableCell>
                      <TableCell className="font-medium text-xs">{f.nome}</TableCell>
                      <TableCell className="text-xs text-slate-500">{f.tamanho}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2"><Users size={16}/> Seleção de Clientes</h3>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <Input 
                  placeholder="Código, Nome ou Razão..." 
                  className="h-8 pl-8 text-xs" 
                  value={buscaCliente}
                  onChange={(e) => setBuscaCliente(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[150px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center"><Checkbox onClick={() => selecionarTodasEmpresas()}/></TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome Fantasia</TableHead>
                    <TableHead>Razão Social</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesFiltrados.map(c => (
                    <TableRow key={c.id} className="cursor-pointer" onClick={() => toggleCliente(c.id)}>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selectedClientes.includes(c.id)} onCheckedChange={() => toggleCliente(c.id)} />
                      </TableCell>
                      <TableCell className="text-xs font-bold text-blue-600">{c.id}</TableCell>
                      <TableCell className="text-xs font-medium">{c.nomeFantasia}</TableCell>
                      <TableCell className="text-xs text-slate-500">{c.razaoSocial}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

        </div>
      </div>
    </div>
  );
}