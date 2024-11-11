import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewsTable from "main/components/MenuItemReviews/MenuItemReviewsTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function MenuItemReviewsIndexPage() {
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/menuitemreviews/create"
          style={{ float: "right" }}
        >
          Create MenuItemReviews
        </Button>
      );
    }
  };

  const {
    data: review,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/menuitemreview/all"],
    { method: "GET", url: "/api/menuitemreview/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>MenuItemReviews</h1>
        <MenuItemReviewsTable review={review} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
