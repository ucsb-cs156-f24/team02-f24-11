import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import HelpRequestIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import MenuItemReviewsIndexPage from "main/pages/MenuItemReviews/MenuItemReviewsIndexPage";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

import UCSBOrganizationIndexPage from "main/pages/UCSBOrganization/UCSBOrganizationIndexPage";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

import UCSBDiningCommonsMenuItemsIndexPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsIndexPage";
import UCSBDiningCommonsMenuItemsCreatePage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsCreatePage";
import UCSBDiningCommonsMenuItemsEditPage from "main/pages/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsEditPage";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";

import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Route exact path="/admin/users" element={<AdminUsersPage />} />
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/ucsbdates/edit/:id"
              element={<UCSBDatesEditPage />}
            />
            <Route
              exact
              path="/ucsbdates/create"
              element={<UCSBDatesCreatePage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/restaurants"
              element={<RestaurantIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/restaurants/edit/:id"
              element={<RestaurantEditPage />}
            />
            <Route
              exact
              path="/restaurants/create"
              element={<RestaurantCreatePage />}
            />
          </>
        )}

        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/menuitemreviews"
              element={<MenuItemReviewsIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/menuitemreviews/edit/:id"
              element={<MenuItemReviewsEditPage />}
            />
            <Route
              exact
              path="/menuitemreviews/create"
              element={<MenuItemReviewsCreatePage />}
            />
          </>
        )}

        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/ucsbdiningcommonsmenuitems"
              element={<UCSBDiningCommonsMenuItemsIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/ucsbdiningcommonsmenuitems/edit/:id"
              element={<UCSBDiningCommonsMenuItemsEditPage />}
            />
            <Route
              exact
              path="/ucsbdiningcommonsmenuitems/create"
              element={<UCSBDiningCommonsMenuItemsCreatePage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/RecommendationRequest"
              element={<RecommendationRequestIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/RecommendationRequest/edit/:id"
              element={<RecommendationRequestEditPage />}
            />
            <Route
              exact
              path="/RecommendationRequest/create"
              element={<RecommendationRequestCreatePage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route exact path="/articles" element={<ArticlesIndexPage />} />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/articles/edit/:id"
              element={<ArticlesEditPage />}
            />
            <Route
              exact
              path="/articles/create"
              element={<ArticlesCreatePage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/placeholder"
              element={<PlaceholderIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/placeholder/edit/:id"
              element={<PlaceholderEditPage />}
            />
            <Route
              exact
              path="/placeholder/create"
              element={<PlaceholderCreatePage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/ucsborganizations"
              element={<UCSBOrganizationIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/ucsborganizations/edit/:orgCode"
              element={<UCSBOrganizationEditPage />}
            />
            <Route
              exact
              path="/ucsborganizations/create"
              element={<UCSBOrganizationCreatePage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/helprequest"
              element={<HelpRequestIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/helprequest/edit/:id"
              element={<HelpRequestEditPage />}
            />
            <Route
              exact
              path="/helprequest/create"
              element={<HelpRequestCreatePage />}
            />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
