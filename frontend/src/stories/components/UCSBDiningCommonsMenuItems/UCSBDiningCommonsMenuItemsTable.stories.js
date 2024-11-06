import React from "react";
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title:
    "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable",
  component: UCSBDiningCommonsMenuItemsTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  ucsbdiningcommonsmenuitems: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  ucsbdiningcommonsmenuitems:
    ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  ucsbdiningcommonsmenuitems:
    ucsbDiningCommonsMenuItemsFixtures.threeUcsbDiningCommonsMenuItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbDiningCommonsMenuItems", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
