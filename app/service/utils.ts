export function limitarTexto(texto: string, limite: number): string {
  if (texto.length <= limite) {
    return texto;
  } else {
    return texto.substring(0, limite) + "...";
  }
}