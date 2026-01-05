import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface DataListProps {
  entities: Entity[];
  selectedIds?: number[];
  // Agora aceita um ID único ou um array de IDs para o Shift
  onToggle?: (id: number | number[]) => void;
  onClose?: () => void;
  title: string;
}

interface Entity {
  id: number;
  label: string;
  sublabel: string;
  extra?: string;
}

export function DataList({ entities, selectedIds = [], onToggle, onClose, title }: DataListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastClickedId, setLastClickedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const isSelectionMode = !!onToggle;

    const filteredEntities = useMemo(() => {
    if (!searchTerm) return entities;
    
    return entities.filter(ent => 
      ent.label.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  }, [entities, searchTerm]);

  // --- LÓGICA DE PAGINAÇÃO ---
 const { paginatedData, totalPages } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return {
        // Usamos a lista filtrada aqui!
        paginatedData: filteredEntities.slice(start, start + itemsPerPage),
        totalPages: Math.ceil(filteredEntities.length / itemsPerPage) || 1
    };
    }, [filteredEntities, currentPage]);

  // --- LÓGICA DE SHIFT + CLICK ---
  const handleRowClick = (e: React.MouseEvent, currentId: number) => {
    if (!onToggle) return;

    if (e.shiftKey && lastClickedId !== null) {
      const currentIndex = entities.findIndex(ent => ent.id === currentId);
      const lastIndex = entities.findIndex(ent => ent.id === lastClickedId);

      const start = Math.min(currentIndex, lastIndex);
      const end = Math.max(currentIndex, lastIndex);

      // Pega todos os IDs no intervalo
      const rangeIds = entities.slice(start, end + 1).map(ent => ent.id);
      
      // Envia o array para o pai processar de uma vez
      onToggle(rangeIds);
    } else {
      onToggle(currentId);
    }
    setLastClickedId(currentId);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };


  

  return (
    <>
      <div 
        className="fixed inset-0 select-none z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose} 
      />

      <div className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      w-[95%] max-w-4xl h-[85vh] bg-white rounded-xl shadow-2xl 
                      flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 font-bold border-b flex items-center justify-between text-slate-700">
          <span className="text-xl">{title} <span className="text-sm font-normal text-slate-400">({entities.length} itens)</span></span>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-red-100 group transition-all">
            <X className="text-red-500 group-hover:rotate-90 transition-all" />
          </button>
        </div>

        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome ou detalhe..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="flex-1 overflow-y-auto p-4">
          <Table className="table-fixed w-full">
            <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
              <TableRow>
                {isSelectionMode && <TableHead className="w-16"></TableHead>}
                <TableHead>Nome</TableHead>
                <TableHead>Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="hover:bg-slate-50 cursor-pointer select-none transition-colors"
                  onClick={(e) => handleRowClick(e, item.id)}
                >
                  {isSelectionMode && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={() => onToggle(item.id)} />
                    </TableCell>
                  )}
                  <TableCell className="truncate font-medium py-4 text-slate-700">{item.label}</TableCell>
                  <TableCell className="truncate text-sm text-muted-foreground">{item.sublabel || "---"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer com Paginação */}
        <div className="p-4 border-t bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">Página {currentPage} de {totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 border rounded bg-white disabled:opacity-30 hover:bg-slate-50"
            >
              Anterior
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 border rounded bg-white disabled:opacity-30 hover:bg-slate-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </>
  );
}