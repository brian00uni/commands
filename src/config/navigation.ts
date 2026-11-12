import { FileText, Sparkles } from 'lucide-react';
export const navigation = [
  { id: 'builder', label: '명령문 생성기', icon: Sparkles },
  { id: 'documents', label: '원본 문서 안내', icon: FileText },
] as const;
export type NavigationId = (typeof navigation)[number]['id'];
