import React from "react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";

export default {
  title: "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemForm",
  component: UCSBDiningCommonsMenuItemForm,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  ucsbDiningCommonsMenuItem:
    ucsbDiningCommonsMenuItemsFixtures.oneUcsbDiningCommonsMenuItem,
  buttonLabel: "Create",

  submitAction: (data) => {
    console.log("Submit", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents:
    ucsbDiningCommonsMenuItemsFixtures.oneUcsbDiningCommonsMenuItem,
  buttonLabel: "Update",

  submitAction: (data) => {
    console.log("Submit", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
