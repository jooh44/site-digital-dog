import type { Metadata } from 'next';
import WorkbenchClient from './WorkbenchClient';

export const metadata: Metadata = {
  title: 'Workbench — Digital Dog Component Lab',
  description: 'Internal laboratory of visual components. Real React/Canvas/SVG, not CSS mockups.',
  robots: { index: false, follow: false },
};

export default function WorkbenchPage() {
  return <WorkbenchClient />;
}
