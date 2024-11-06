import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/MenuItemReviewsUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function MenuItemReviewsTable({ dates, currentUser }) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/menuitemreview/edit/${cell.row.values.id}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/menuitemreview/all"],
  );
  // Stryker restore all

  // Stryker disable next-line all : TODO try to make a good test for this
  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "itemId",
      accessor: "itemId",
    },
    {
      Header: "reviewEmail",
      accessor: "reviewEmail",
    },
    {
      Header: "stars",
      accessor: "stars",
    },
    {
       Header: "dateReviewed",
       accessor: "dateReviewed",
    },
    {
        Header: "comments",
        accessor: "comments",
    },
  ];




  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn("Edit", "primary", editCallback, "MenuItemReviewsTable"),
    );
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, "MenuItemReviewsTable"),
    );
  }

  return <OurTable data={dates} columns={columns} testid={"MenuItemReviewsTable"} />;
}
