// ==========================
// Status Mapping
// ==========================
export type BackendNodeStatus = 'idle' | 'running' | 'success' | 'error';
export type NodeStatus = 'initial' | 'loading' | 'success' | 'error';

export function mapStatus(backendStatus: BackendNodeStatus): NodeStatus {
  const statusMap: Record<BackendNodeStatus, NodeStatus> = {
    idle: 'initial',
    running: 'loading',
    success: 'success',
    error: 'error',
  };

  return statusMap[backendStatus];
}

// ==========================
// Types
// ==========================
export interface LogEntry {
  timestamp: string;
  message: string;
}

export interface PipelineStatusResponse {
  runId: string;
  status: 'idle' | 'running' | 'success' | 'error' | 'cancelled';
  nodes: Record<string, BackendNodeStatus>;
  result?: any;
  error?: string | null;
  logs: LogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface StartPipelineResponse {
  runId: string;
  message?: string;
  status: string;
}

// ==========================
// Backend Base URL
// ==========================
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// ==========================
// API Calls
// ==========================
export async function startPipeline(
  formData: FormData
): Promise<StartPipelineResponse> {
  const res = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to start pipeline');
  }

  return res.json();
}

export async function fetchStatus(
  runId: string
): Promise<PipelineStatusResponse> {
  const res = await fetch(`${API_BASE}/status/${runId}`);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Not found' }));
    throw new Error(error.error || 'Failed to fetch status');
  }

  return res.json();
}

export async function cancelRun(runId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/cancel/${runId}`, {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Failed to cancel run');
  }
}
