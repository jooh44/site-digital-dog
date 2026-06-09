'use client';

import { useMemo, useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackCodeEditor,
} from '@codesandbox/sandpack-react';
import { buildSandbox } from './_lib/buildSandbox';

interface RegistryFile {
  path: string;
  content?: string;
  type?: string;
}

const PREVIEW_HEIGHT = '74vh';

export default function LiveSandbox({
  name,
  files,
  dependencies,
}: {
  name: string;
  files: RegistryFile[];
  dependencies: string[];
}) {
  const result = useMemo(() => buildSandbox(name, files, dependencies), [name, files, dependencies]);
  const [editing, setEditing] = useState(false);

  if (!result.ok) {
    return (
      <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        Render ao vivo indisponível: {result.reason}. Use a aba <strong>Código</strong> + o comando CLI.
      </div>
    );
  }

  return (
    <SandpackProvider
      template="react-ts"
      theme="dark"
      files={result.files}
      customSetup={{ dependencies: result.dependencies }}
      options={{ recompileMode: 'delayed', recompileDelay: 400 }}
    >
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => setEditing((v) => !v)}
          className="text-[11px] font-mono px-2.5 py-1 rounded border border-[#252830] text-[#9ca3af] hover:text-white hover:border-[#00bcd4]/40 transition-colors"
        >
          {editing ? '✕ fechar editor' : '✎ editar ao vivo'}
        </button>
      </div>

      <SandpackLayout style={{ flexWrap: 'nowrap' }}>
        {editing && (
          <SandpackCodeEditor
            style={{ height: PREVIEW_HEIGHT, width: '42%', minWidth: 0 }}
            showLineNumbers
            showTabs
            wrapContent
          />
        )}
        <SandpackPreview
          style={{ height: PREVIEW_HEIGHT, width: editing ? '58%' : '100%', minWidth: 0 }}
          showOpenInCodeSandbox
          showRefreshButton
        />
      </SandpackLayout>

      {editing && (
        <p className="text-[11px] text-[#6b7280] mt-2">
          Dica: alguns componentes precisam de props (ex.: <code className="text-[#00bcd4]">images</code>,{' '}
          <code className="text-[#00bcd4]">items</code>). Edite o <code className="text-[#00bcd4]">App.tsx</code> pra
          passar o que falta.
        </p>
      )}
    </SandpackProvider>
  );
}
