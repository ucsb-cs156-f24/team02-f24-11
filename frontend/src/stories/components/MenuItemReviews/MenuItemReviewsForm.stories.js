import React from "react";
import MenuItemReviewsForm from "main/components/MenuItemReviews/MenuItemReviewsForm";
import { menuItemReviewsFixtures } from "fixtures/menuItemReviewsFixtures";
export default {
  title: "components/MenuItemReviews/MenuItemReviewsForm",
  component: MenuItemReviewsForm,
};
const Template = (args) => {
  return <MenuItemReviewsForm {...args} />;
};
export const Create = Template.bind({});
Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
export const Update = Template.bind({});
Update.args = {
  initialContents: menuItemReviewsFixtures.oneReview,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};