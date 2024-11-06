import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";
import { http, HttpResponse } from "msw";

import UCSBDiningCommonsMenuItemsIndexPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsIndexPage";

export default {
  title: "pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsIndexPage",
  component: UCSBDiningCommonsMenuItemsIndexPage,
};

const Template = () => {
  return <UCSBDiningCommonsMenuItemsIndexPage storybook={true} />;
};

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
    http.get("/api/ucsbdiningcommonsmenuitems/all", () => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems,
        {
          status: 200,
        },
      );
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
    http.get("/api/ucsbdiningcommonsmenuitems/all", () => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems,
        {
          status: 200,
        },
      );
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
    http.get("/api/ucsbdiningcommonsmenuitems/all", () => {
      return HttpResponse.json(
        ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems,
      );
    }),
    http.delete("/api/ucsbdiningcommonsmenuitems", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
