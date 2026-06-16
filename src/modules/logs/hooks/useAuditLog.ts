import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MOCK_AUDIT_ENTRIES } from "../data/mock";
import {
  fetchAuditLog,
  fetchAuditEntry,
  getAuditExport,
  requestAuditExport,
} from "../services/audit.service";
import { auditKeys } from "../services/audit.keys";
import type { AuditEntry, AuditFilters, ExportStatus } from "../type/audit-log";
import type { PaginatedResponse } from "@/config/types/generic";

const ACTIVE_MOCK   = MOCK_AUDIT_ENTRIES.filter((e) => !e.is_archived);
const ARCHIVED_MOCK = MOCK_AUDIT_ENTRIES.filter((e) => e.is_archived);

function makePlaceholder(entries: AuditEntry[]): PaginatedResponse<AuditEntry> {
  return { data: entries, total: entries.length, page: 1, limit: 20, totalPages: 1 };
}

export function useAuditLog(filters?: AuditFilters) {
  const isArchived = filters?.is_archived === true;
  const placeholder = makePlaceholder(isArchived ? ARCHIVED_MOCK : ACTIVE_MOCK);

  const query = useQuery({
    queryKey:        auditKeys.list(filters),
    queryFn:         () => fetchAuditLog(filters),
    placeholderData: placeholder,
    staleTime:       60_000,
    retry:           1,
  });

  const resolved = query.data ?? placeholder;
  return {
    entries:    resolved.data,
    total:      resolved.total,
    page:       resolved.page,
    totalPages: resolved.totalPages,
    isLoading:  query.isLoading,
  };
}

export function useAuditDetail(id: string) {
  return useQuery({
    queryKey: auditKeys.detail(id),
    queryFn:  () => fetchAuditEntry(id),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useAuditExport() {
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [downloadUrl,  setDownloadUrl]  = useState<string | null>(null);

  const pollExport = (exportId: string): void => {
    const poll = setInterval(async () => {
      try {
        const job = await getAuditExport(exportId);
        if (job.status === "ready" && job.download_url) {
          clearInterval(poll);
          setExportStatus("ready");
          setDownloadUrl(job.download_url);
          window.open(job.download_url, "_blank", "noopener,noreferrer");
        } else if (job.status === "failed") {
          clearInterval(poll);
          setExportStatus("failed");
        }
      } catch {
        clearInterval(poll);
        setExportStatus("failed");
      }
    }, 3000);
    setTimeout(() => {
      clearInterval(poll);
      if (exportStatus === "pending") setExportStatus("failed");
    }, 5 * 60 * 1000);
  };

  const request = useMutation({
    mutationFn: ({
      format,
      filters,
    }: {
      format: "csv" | "pdf";
      filters?: AuditFilters;
    }) => requestAuditExport(format, filters),
    onMutate:  () => setExportStatus("pending"),
    onSuccess: (job) => { pollExport(job.id); },
    onError:   () => setExportStatus("failed"),
  });

  return {
    request,
    exportStatus,
    downloadUrl,
    resetExport: () => { setExportStatus("idle"); setDownloadUrl(null); },
  };
}
