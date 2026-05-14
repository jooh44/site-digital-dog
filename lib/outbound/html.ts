const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  quot: '"',
  lt: '<',
  gt: '>',
  nbsp: ' ',
  rsquo: "'",
  lsquo: "'",
  ordm: 'º',
  Aacute: 'Á',
  aacute: 'á',
  Acirc: 'Â',
  acirc: 'â',
  Agrave: 'À',
  agrave: 'à',
  Atilde: 'Ã',
  atilde: 'ã',
  Auml: 'Ä',
  auml: 'ä',
  Eacute: 'É',
  eacute: 'é',
  Ecirc: 'Ê',
  ecirc: 'ê',
  Egrave: 'È',
  egrave: 'è',
  Euml: 'Ë',
  euml: 'ë',
  Iacute: 'Í',
  iacute: 'í',
  Icirc: 'Î',
  icirc: 'î',
  Igrave: 'Ì',
  igrave: 'ì',
  Iuml: 'Ï',
  iuml: 'ï',
  Oacute: 'Ó',
  oacute: 'ó',
  Ocirc: 'Ô',
  ocirc: 'ô',
  Ograve: 'Ò',
  ograve: 'ò',
  Otilde: 'Õ',
  otilde: 'õ',
  Ouml: 'Ö',
  ouml: 'ö',
  Uacute: 'Ú',
  uacute: 'ú',
  Ucirc: 'Û',
  ucirc: 'û',
  Ugrave: 'Ù',
  ugrave: 'ù',
  Uuml: 'Ü',
  uuml: 'ü',
  Ccedil: 'Ç',
  ccedil: 'ç',
  Ntilde: 'Ñ',
  ntilde: 'ñ',
}

export function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (_, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16))
    }

    if (entity.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10))
    }

    return NAMED_HTML_ENTITIES[entity] ?? `&${entity};`
  })
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

