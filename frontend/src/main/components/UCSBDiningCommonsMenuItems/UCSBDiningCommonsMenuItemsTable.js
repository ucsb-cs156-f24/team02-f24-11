import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDiningCommonsMenuItemsTable({
  ucsbdiningcommonsmenuitems,
  currentUser,
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/ucsbdiningcommonsmenuitems/edit/${cell.row.values.id}`);
  };

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsbdiningcommonsmenuitems/all"],
  );

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Dining Commons Code",
      accessor: "diningCommonsCode",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Station",
      accessor: "station",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn(
        "Edit",
        "primary",
        editCallback,
        "UCSBDiningCommonsMenuItemsTable",
      ),
    );
    columns.push(
      ButtonColumn(
        "Delete",
        "danger",
        deleteCallback,
        "UCSBDiningCommonsMenuItemsTable",
      ),
    );
  }

  return (
    <OurTable
      data={ucsbdiningcommonsmenuitems}
      columns={columns}
      testid={"UCSBDiningCommonsMenuItemsTable"}
    />
  );
}
