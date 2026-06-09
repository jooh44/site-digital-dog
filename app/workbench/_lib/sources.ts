// Metadados de exibição das fontes. Os ids dos registries batem com build-catalog.mjs.

export interface SourceMeta {
  id: string;
  label: string;
  site: string;
  /** Comando de instalação via shadcn CLI, {name} é substituído pelo nome do item. */
  cli?: string;
  /** Fontes sem registry enumerável entram como card de referência (link-only). */
  linkOnly?: boolean;
  accent: string;
}

export const SOURCES: Record<string, SourceMeta> = {
  reactbits: {
    id: 'reactbits',
    label: 'React Bits',
    site: 'https://reactbits.dev',
    cli: 'npx shadcn@latest add https://reactbits.dev/r/{name}.json',
    accent: '#00bcd4',
  },
  kokonut: {
    id: 'kokonut',
    label: 'Kokonut UI',
    site: 'https://kokonutui.com',
    cli: 'npx shadcn@latest add https://kokonutui.com/r/{name}.json',
    accent: '#a78bfa',
  },
  unlumen: {
    id: 'unlumen',
    label: 'unlumen UI',
    site: 'https://ui.unlumen.com',
    cli: 'npx shadcn@latest add https://ui.unlumen.com/r/{name}.json',
    accent: '#f59e0b',
  },
};

// Fontes de referência sem registry enumerável (cards link-only no feed).
export const REFERENCE_SOURCES: SourceMeta[] = [
  {
    id: 'watermelon',
    label: 'Watermelon UI',
    site: 'https://ui.watermelon.sh',
    linkOnly: true,
    accent: '#fb7185',
  },
  {
    id: 'morphin',
    label: 'Morphin',
    site: 'https://morphin.dev',
    linkOnly: true,
    accent: '#34d399',
  },
];

export interface CatalogItem {
  id: string;
  source: string;
  name: string;
  title: string;
  description: string;
  category: string;
  dependencies: string[];
  registryDependencies: string[];
  live: boolean;
  itemUrl: string;
}

export interface Catalog {
  generatedAt: string;
  total: number;
  sources: string[];
  items: CatalogItem[];
}
