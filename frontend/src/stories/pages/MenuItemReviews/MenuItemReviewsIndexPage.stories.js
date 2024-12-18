import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewsIndexPage from "main/pages/MenuItemReviews/MenuItemReviewsIndexPage";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsIndexPage",
  component: MenuItemReviewsIndexPage,
};

const Template = () => <MenuItemReviewsIndexPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/menuitemreview/all", () => {
      return HttpResponse.json([], { status: 200 });
    }),
  ],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/menuitemreview/all", () => {
      return HttpResponse.json(menuItemReviewsFixtures.threeReview);
    }),
  ],
};

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser);
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither);
    }),
    http.get("/api/menuitemreview/all", () => {
      return HttpResponse.json(menuItemReviewsFixtures.threeReview);
    }),
    http.delete("/api/menuitemreview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
