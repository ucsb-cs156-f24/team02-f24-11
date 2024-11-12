import React from "react";
import MenuItemReviewsTable from "main/components/MenuItemReviews/MenuItemReviewsTable";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/MenuItemReviews/MenuItemReviewsTable",
  component: MenuItemReviewsTable,
};

const Template = (args) => {
  return <MenuItemReviewsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  review: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  review: menuItemReviewsFixtures.threeReview,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  review: menuItemReviewsFixtures.threeReview,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/menuitemreview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
