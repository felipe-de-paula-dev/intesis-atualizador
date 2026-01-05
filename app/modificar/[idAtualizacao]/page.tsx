import ModificarAtualizacao from "@/components/pages/modificar-atualizacoes";

interface PageProps {
  params: Promise<{ idAtualizacao: string }>;
}

export default async function Home({ params }: PageProps) {

  const resolvedParams = await params;
  const idNum = parseInt(resolvedParams.idAtualizacao, 10);

  return (
  <div className="flex min-h-screen w-full font-sans">
    <div className="flex bg-slate-50 w-full items-start justify-center">
      <ModificarAtualizacao idAtualizacao={idNum} />
    </div>
  </div>
  );
}
