"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";
import EmptyState from "./EmptyState";
import { TableSkeleton } from "@/shared/loaders/LoadingSkeleton";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  loading?: boolean;
  pageSize?: number;
  className?: string;
  selectable?: boolean;
  onSelectionChange?: (rows: T[]) => void;
}

function SelectCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): React.ReactNode {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate ?? false;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 accent-blue-600 cursor-pointer"
    />
  );
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  pageSize = 20,
  className,
  selectable = false,
  onSelectionChange,
}: DataTableProps<T>): React.ReactNode {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  const checkboxColumn: ColumnDef<T, unknown> = {
    id: "__select__",
    enableSorting: false,
    size: 44,
    header: ({ table }) => (
      <SelectCheckbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <SelectCheckbox
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  };

  const allColumns = selectable ? [checkboxColumn, ...columns] : columns;

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: selectable,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize } },
  });

  useEffect(() => {
    if (selectable && onSelectionChangeRef.current) {
      const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
      onSelectionChangeRef.current(selectedRows);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, selectable]);

  const { pageIndex, pageSize: ps } = table.getState().pagination;
  const totalRows = data.length;
  const from = pageIndex * ps + 1;
  const to = Math.min((pageIndex + 1) * ps, totalRows);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/60">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={header.column.columnDef.size ? { width: header.column.columnDef.size } : undefined}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500",
                      header.column.getCanSort() && "cursor-pointer select-none hover:text-gray-800 transition-colors"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-50 bg-white">
            {loading ? (
              <TableSkeleton rows={8} cols={allColumns.length} />
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length}>
                  <EmptyState />
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "hover:bg-gray-50/60 transition-colors",
                    selectable && row.getIsSelected() && "bg-blue-50/40"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalRows > 0 && (
        <div className="flex items-center justify-between px-1 py-3">
          <p className="text-xs text-gray-500">
            {selectable && Object.keys(rowSelection).length > 0
              ? `${Object.keys(rowSelection).length} selected · `
              : ""}
            Showing {from}–{to} of {totalRows} results
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-600",
                "hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              )}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 text-xs text-gray-600">
              {pageIndex + 1} / {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-600",
                "hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              )}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
