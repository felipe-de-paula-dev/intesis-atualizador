"use client";

import React, { useEffect, useState } from "react"
import { Edit, Trash2, Plus, Search, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DatePickerWithRange } from "../ui/date-range-picker";
import Link from "next/link";
import { addDays, set } from "date-fns";
import { DateRange } from "react-day-picker";
import { is } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Update {
  id: number;
  aplicacao: any;
  data: string;
  descricao: string;
}

export function GerenciadorAtualizacoes() {
  const [busca, setBusca] = useState("")
  const [updates, setUpdates] = useState<Update[]>([])
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [isFetch, setIsFetch] = useState(false);
  const [aplicacao, setAplicacao] = useState("0");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const fetchUpdates = async (page: number, isIgnoreDate: boolean) => {

    const params = new URLSearchParams({
      page: page.toString(),
      size: "10"
    });

    if (date && date.from && !isIgnoreDate) {
    params.append("inicio", date.from.toISOString().split('T')[0] + "T00:00:00");

    if (date.to && !isIgnoreDate) {
      params.append("fim", date.to.toISOString().split('T')[0] + "T23:59:59");
    }}

    if (busca) params.append("codigo", busca);

    if (aplicacao !== "0") params.append("aplicacao", aplicacao);

    console.log(`http://192.168.0.19:8080/api/atualizacao/pesquisar?${params.toString()}`)

    const response = await fetch(`http://192.168.0.19:8080/api/atualizacao/pesquisar?${params.toString()}`);

    const data = await response.json();
    setUpdates(data.content); 
    setTotalPaginas(data.totalPages);
  };

  useEffect(() => {
    fetchUpdates(paginaAtual, true);
  }, [paginaAtual, aplicacao]);


  useEffect(() => {
    const timer = setTimeout(() => {
        setIsFetch(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isFetch]);

  const excluirUpdate = (id: number) => {
    setUpdates(updates.filter(u => u.id !== id))
  }

  return (
    <div className="space-y-1 w-full p-6 flex flex-col justify-between">
    <div>
        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Atualização de Sistema</h1>
        <p className="text-slate-500 text-sm">Visualize as atualizações lançadas.</p>
    </div>
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 w-full d">
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Buscar por código..." 
                    className="pl-10" 
                    value={busca}
                    type="number"
                    onChange={(e) => setBusca(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchUpdates(0, true)}
                />
            </div>  
            <Select value={aplicacao} onValueChange={setAplicacao}>
                <SelectTrigger className="bg-white">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">TODOS</SelectItem>
                    <SelectItem value="1">ERP</SelectItem>
                    <SelectItem value="2">PREVENDA</SelectItem>
                    <SelectItem value="4">SAT</SelectItem>
                </SelectContent>
            </Select>
            <DatePickerWithRange date={date} setDate={setDate} onChange={() => fetchUpdates(0, false)}/>
        <Button variant="outline" className="gap-2" onClick={() => {fetchUpdates(0, true); setIsFetch(true)}}>
            <RefreshCw size={16} className={`${isFetch ? "animate-spin" : ""}`} /> Atualizar
        </Button>
        </div>

  
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Link href="/cadastrar">Nova Atualização</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
             <div className="text-sm text-slate-500">
                Página 
                <Input className="w-24 text-center mx-2" type="number" min="1" max={totalPaginas} value={paginaAtual + 1} onChange={(e) => setPaginaAtual(parseInt(e.target.value != "0" ? e.target.value : "0") - 1)} /> de {totalPaginas}
            </div>
            <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === 0}
                onClick={() => setPaginaAtual(prev => prev - 1)}
                >
                Anterior
                </Button>
                <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual >= totalPaginas - 1}
                onClick={() => setPaginaAtual(prev => prev + 1)}
                >
                Próximo
                </Button>
            </div>
        </div>
      <div className="rounded-xl h-max-1/3 border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Sistema</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updates?.length > 0 ? (
              updates.map((u: any) => (
                <TableRow key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-semibold text-slate-700">{
                  (u.aplicacao.id === 1 && "ERP") ||
                  (u.aplicacao.id === 2 && "PREVENDA") ||
                  (u.aplicacao.id === 4 && "PDV")
                  }</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {u.id}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500">{u.data ? new Date((u.data)).toLocaleDateString('pt-BR') : 'Sem data'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs text-slate-600 font-medium`}>
                      {u.descricao}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Link href={`/modificar/${u.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                            <Edit size={16} />
                        </Button>                    
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:text-red-600"
                      onClick={() => excluirUpdate(u.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                  Nenhuma atualização encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
         <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
             <div className="text-sm text-slate-500">
                Página 
                <Input className="w-24 text-center mx-2" type="number" min="1" max={totalPaginas} value={paginaAtual + 1} onChange={(e) => setPaginaAtual(parseInt(e.target.value != "0" ? e.target.value : "0") - 1)} /> de {totalPaginas}
            </div>
            <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual === 0}
                onClick={() => setPaginaAtual(prev => prev - 1)}
                >
                Anterior
                </Button>
                <Button
                variant="outline"
                size="sm"
                disabled={paginaAtual >= totalPaginas - 1}
                onClick={() => setPaginaAtual(prev => prev + 1)}
                >
                Próximo
                </Button>
            </div>
        </div>
    </div>
  )
}