import React, { ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface Column<T> {
  key: keyof T;
  label: string;
  renderCell?: (value: T[keyof T], row: T, isLoading?: boolean) => ReactNode;
  renderHeader?: (value: Column<T>) => ReactNode;
  cellClassName?: string;
  headerClassName?: string;
  width?: string;
  getRowspan?: (row: T) => number;
  getColspan?: (row: T) => number;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  tableClassName?: string;
  cellsClass?: string;
  rowsClass?: string;
  headersClass?: string;
  bodyClassName?: string;
  isLoading?: boolean;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  tableClassName,
  className = '',
  cellsClass,
  rowsClass,
  headersClass,
  bodyClassName,
  isLoading,
}: TableProps<T>) {
  const defaultFormatValue = (value: any): string | ReactNode => {
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'boolean') return <i className={value ? 'cbi-tick-square' : 'cbi-close-square'} />;

    return String(value);
  };

  const renderCell = useCallback(
    (column: Column<T>, row: T) => {
      const value = row[column.key];

      return column.renderCell ? column.renderCell(value, row, isLoading) : defaultFormatValue(value);
    },
    [isLoading]
  );

  return (
    <div className={twMerge(clsx('w-full overflow-x-auto', className))}>
      <table className={twMerge('w-full table-fixed border-separate border-spacing-0', tableClassName)}>
        <thead className="text-lg font-medium leading-8 text-main md:text-xl">
          <tr className={`${headersClass}`}>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={twMerge(clsx('relative', column.headerClassName))}
                style={{ width: column.width }}
              >
                {column.renderHeader?.(column) || column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={bodyClassName}>
          {data.map((row: T, rowIndex: number) => (
            <tr key={`table-row-${rowIndex}`} className={rowsClass}>
              {columns.map((column: Column<T>, colIndex: number) => {
                const rowspanValue = column.getRowspan?.(row);
                const colspanValue = column.getColspan?.(row);

                const isCoveredByColspan = columns.some((prevColumn, prevIndex) => {
                  if (prevIndex >= colIndex) return false;
                  const prevColspan = prevColumn.getColspan?.(row);
                  return typeof prevColspan === 'number' && prevColspan > colIndex - prevIndex;
                });

                if (rowspanValue! <= 0 || isCoveredByColspan) return null;

                return (
                  <td
                    key={String(column.key)}
                    className={twMerge('h-full text-center align-middle', cellsClass, column.cellClassName)}
                    rowSpan={rowspanValue ?? 1}
                    colSpan={colspanValue ?? 1}
                  >
                    {renderCell(column, row)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
