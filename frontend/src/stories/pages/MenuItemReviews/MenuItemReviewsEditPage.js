import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewsEditPage from "main/pages/MenuItemReviewss/MenuItemReviewsEditPage";

const MenuItemReviewsEditPageStory = {
    title: "pages/MenuItemReviews/MenuItemReviewsEditPage",
    component: MenuItemReviewsEditPage,
  };
  
  export default MenuItemReviewsEditPageStory;
  

const Template = () => <MenuItemReviewsEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
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
    http.get("/api/menuitemreview", () => {
      return HttpResponse.json(menuItemReviewsFixtures.threeDates[0], {
        status: 200,
      });
    }),
    http.put("/api/menuitemreview", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
