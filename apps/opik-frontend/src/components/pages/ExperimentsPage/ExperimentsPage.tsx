import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { keepPreviousData } from "@tanstack/react-query";
import useLocalStorageState from "use-local-storage-state";
import { RowSelectionState } from "@tanstack/react-table";

import DataTable from "@/components/shared/DataTable/DataTable";
import DataTablePagination from "@/components/shared/DataTablePagination/DataTablePagination";
import DataTableNoData from "@/components/shared/DataTableNoData/DataTableNoData";
import FeedbackScoresCell from "@/components/shared/DataTableCells/FeedbackScoresCell";
import IdCell from "@/components/shared/DataTableCells/IdCell";
import ResourceCell, {
  RESOURCE_TYPE,
} from "@/components/shared/DataTableCells/ResourceCell";
import useExperimentsList from "@/api/datasets/useExperimentsList";
import { Experiment } from "@/types/datasets";
import Loader from "@/components/shared/Loader/Loader";
import useAppStore from "@/store/AppStore";
import { formatDate } from "@/lib/date";
import NewExperimentButton from "@/components/shared/NewExperimentButton/NewExperimentButton";
import { COLUMN_TYPE, ColumnData } from "@/types/shared";
import { generateSelectColumDef } from "@/components/shared/DataTable/utils";
import { convertColumnDataToColumn } from "@/lib/table";
import ColumnsButton from "@/components/shared/ColumnsButton/ColumnsButton";
import ExperimentsActionsButton from "@/components/pages/ExperimentsPage/ExperimentsActionsButton";
import SearchInput from "@/components/shared/SearchInput/SearchInput";

const SELECTED_COLUMNS_KEY = "experiments-selected-columns";
const COLUMNS_WIDTH_KEY = "experiments-columns-width";
const COLUMNS_ORDER_KEY = "experiments-columns-order";

const getRowId = (e: Experiment) => e.id;

export const DEFAULT_COLUMNS: ColumnData<Experiment>[] = [
  {
    id: "id",
    label: "ID",
    type: COLUMN_TYPE.string,
    cell: IdCell as never,
  },
  {
    id: "name",
    label: "Name",
    type: COLUMN_TYPE.string,
  },
  {
    id: "dataset",
    label: "Dataset",
    type: COLUMN_TYPE.string,
    cell: ResourceCell as never,
    customMeta: {
      nameKey: "dataset_name",
      idKey: "dataset_id",
      resource: RESOURCE_TYPE.dataset,
    },
  },
  {
    id: "created_at",
    label: "Created",
    type: COLUMN_TYPE.time,
    accessorFn: (row) => formatDate(row.created_at),
  },
  {
    id: "trace_count",
    label: "Trace count",
    type: COLUMN_TYPE.number,
  },
  {
    id: "feedback_scores",
    label: "Feedback scores (average)",
    type: COLUMN_TYPE.numberDictionary,
    cell: FeedbackScoresCell as never,
  },
];

export const DEFAULT_SELECTED_COLUMNS: string[] = [
  "name",
  "dataset",
  "created_at",
  "feedback_scores",
];

const ExperimentsPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const workspaceName = useAppStore((state) => state.activeWorkspaceName);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data, isPending } = useExperimentsList(
    {
      workspaceName,
      search,
      page,
      size,
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  const experiments = useMemo(() => data?.content ?? [], [data?.content]);
  const total = data?.total ?? 0;
  const noDataText = search
    ? "No search results"
    : "There are no experiments yet";

  const [selectedColumns, setSelectedColumns] = useLocalStorageState<string[]>(
    SELECTED_COLUMNS_KEY,
    {
      defaultValue: DEFAULT_SELECTED_COLUMNS,
    },
  );

  const [columnsOrder, setColumnsOrder] = useLocalStorageState<string[]>(
    COLUMNS_ORDER_KEY,
    {
      defaultValue: [],
    },
  );

  const [columnsWidth, setColumnsWidth] = useLocalStorageState<
    Record<string, number>
  >(COLUMNS_WIDTH_KEY, {
    defaultValue: {},
  });

  const selectedRows: Array<Experiment> = useMemo(() => {
    return experiments.filter((row) => rowSelection[row.id]);
  }, [rowSelection, experiments]);

  const columns = useMemo(() => {
    const retVal = convertColumnDataToColumn<Experiment, Experiment>(
      DEFAULT_COLUMNS,
      {
        columnsOrder,
        columnsWidth,
        selectedColumns,
      },
    );

    retVal.unshift(generateSelectColumDef<Experiment>());

    return retVal;
  }, [selectedColumns, columnsWidth, columnsOrder]);

  const resizeConfig = useMemo(
    () => ({
      enabled: true,
      onColumnResize: setColumnsWidth,
    }),
    [setColumnsWidth],
  );

  const handleRowClick = useCallback(
    (experiment: Experiment) => {
      navigate({
        to: "/$workspaceName/experiments/$datasetId/compare",
        params: {
          datasetId: experiment.dataset_id,
          workspaceName,
        },
        search: {
          experiments: [experiment.id],
        },
      });
    },
    [navigate, workspaceName],
  );

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="comet-title-l">Experiments</h1>
      </div>
      <div className="mb-4 flex items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <SearchInput
            searchText={search}
            setSearchText={setSearch}
            placeholder="Search by name"
            className="w-[320px]"
          ></SearchInput>
        </div>
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && (
            <ExperimentsActionsButton experiments={selectedRows} />
          )}
          <ColumnsButton
            columns={DEFAULT_COLUMNS}
            selectedColumns={selectedColumns}
            onSelectionChange={setSelectedColumns}
            order={columnsOrder}
            onOrderChange={setColumnsOrder}
          ></ColumnsButton>
          <NewExperimentButton />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={experiments}
        onRowClick={handleRowClick}
        resizeConfig={resizeConfig}
        getRowId={getRowId}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        noData={<DataTableNoData title={noDataText} />}
      />
      <div className="py-4 pl-6 pr-5">
        <DataTablePagination
          page={page}
          pageChange={setPage}
          size={size}
          sizeChange={setSize}
          total={total}
        ></DataTablePagination>
      </div>
    </div>
  );
};

export default ExperimentsPage;